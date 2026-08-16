import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BarcodeScanner } from './components/BarcodeScanner';
import { BottomNav } from './components/BottomNav';
import { Brand } from './components/Brand';
import { Icon } from './components/Icon';
import { Modal } from './components/Modal';
import { RecipeCard } from './components/RecipeCard';
import { pantryStaples } from './data/ingredientCatalog';
import { recipes, recipeCount } from './data/recipes';
import { usePersistentState } from './hooks/usePersistentState';
import { buildCookingGuide, inferEquipment } from './lib/cooking';
import { dietLabel } from './lib/dietary';
import { displayIngredient, ingredientVariantKey, localIngredientSearch, normalizeIngredient, splitIngredientInput } from './lib/ingredients';
import { availableSubstitutes, matchRecipes, pantryHas, scaleAmount } from './lib/matching';
import { lookupBarcode } from './services/openFoodFacts';
import { APP_VERSION } from './version';
import type {
  DietaryPreference,
  GroceryItem,
  PantryItem,
  RecipeIngredient,
  RecipeMatch,
  StorageZone,
  Tab,
  UserProfile,
} from './types';

const DEFAULT_PROFILE: UserProfile = {
  firstName: '',
  householdSize: 4,
  diets: [],
  weeknightMinutes: 45,
  onboardingComplete: false,
};

const dietOptions: Array<{ value: DietaryPreference; label: string }> = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-free' },
  { value: 'dairy-free', label: 'Dairy-free' },
  { value: 'pork-free', label: 'No pork' },
  { value: 'nut-free', label: 'Nut-free' },
];

const zoneMeta: Record<StorageZone, { label: string; icon: 'box' | 'fridge' | 'snowflake' }> = {
  pantry: { label: 'Pantry', icon: 'box' },
  fridge: { label: 'Fridge', icon: 'fridge' },
  freezer: { label: 'Freezer', icon: 'snowflake' },
};

function createPantryItem(name: string, zone: StorageZone, extra: Partial<PantryItem> = {}): PantryItem {
  return {
    id: crypto.randomUUID(),
    name: displayIngredient(name),
    normalized: normalizeIngredient(name),
    zone,
    addedAt: new Date().toISOString(),
    ...extra,
  };
}

function createGroceryItem(name: string, sourceRecipeId?: string): GroceryItem {
  return {
    id: crypto.randomUUID(),
    name: displayIngredient(name),
    normalized: normalizeIngredient(name),
    checked: false,
    sourceRecipeId,
    createdAt: new Date().toISOString(),
  };
}

export default function App() {
  const [profile, setProfile] = usePersistentState<UserProfile>('pantrycue.profile.v2', DEFAULT_PROFILE);
  const [pantry, setPantry] = usePersistentState<PantryItem[]>('pantrycue.pantry.v2', []);
  const [grocery, setGrocery] = usePersistentState<GroceryItem[]>('pantrycue.grocery.v2', []);
  const [saved, setSaved] = usePersistentState<string[]>('pantrycue.saved.v2', []);
  const [tab, setTab] = useState<Tab>('home');
  const [selected, setSelected] = useState<RecipeMatch | null>(null);
  const [cookStep, setCookStep] = useState<number | null>(null);
  const [cookServings, setCookServings] = useState(profile.householdSize || 4);
  const [cookIngredientsOpen, setCookIngredientsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [barcodeOpen, setBarcodeOpen] = useState(false);
  const [barcodeLoading, setBarcodeLoading] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<number | undefined>(undefined);

  const matches = useMemo(() => matchRecipes(pantry, recipes, profile.diets), [pantry, profile.diets]);

  const announce = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2500);
  }, []);

  const addIngredients = useCallback((values: string[], zone: StorageZone) => {
    const existing = new Set(pantry.map((item) => ingredientVariantKey(item.name)));
    const additions: PantryItem[] = [];
    for (const raw of values) {
      const trimmed = raw.trim();
      const normalized = normalizeIngredient(trimmed);
      const variantKey = ingredientVariantKey(trimmed);
      if (!trimmed || !normalized || existing.has(variantKey)) continue;
      existing.add(variantKey);
      additions.push(createPantryItem(trimmed, zone));
    }
    if (!additions.length) {
      announce('Those items are already in your kitchen.');
      return;
    }
    setPantry((current) => [...additions, ...current]);
    announce(`${additions.length} item${additions.length === 1 ? '' : 's'} added to ${zoneMeta[zone].label.toLowerCase()}.`);
  }, [announce, pantry, setPantry]);

  const addMissingToGrocery = useCallback((match: RecipeMatch) => {
    const existing = new Set(grocery.map((item) => ingredientVariantKey(item.name)));
    const additions = match.missing
      .filter((ingredient) => !existing.has(ingredientVariantKey(ingredient.name)))
      .map((ingredient) => createGroceryItem(ingredient.name, match.recipe.id));
    if (!additions.length) {
      announce('The missing items are already on your grocery list.');
      return;
    }
    setGrocery((current) => [...current, ...additions]);
    announce(`${additions.length} item${additions.length === 1 ? '' : 's'} added to your grocery list.`);
  }, [announce, grocery, setGrocery]);

  const toggleSaved = useCallback((recipeId: string) => {
    setSaved((current) => current.includes(recipeId) ? current.filter((id) => id !== recipeId) : [...current, recipeId]);
  }, [setSaved]);

  const handleBarcodeDetected = useCallback(async (barcode: string) => {
    if (barcodeLoading) return;
    setBarcodeLoading(true);
    try {
      const product = await lookupBarcode(barcode);
      if (!product) {
        setBarcodeOpen(false);
        announce('I could not find that barcode. Add the item by name instead.');
        return;
      }
      if (pantry.some((item) => ingredientVariantKey(item.name) === ingredientVariantKey(product.name))) {
        announce(`${product.name} is already in your kitchen.`);
        setBarcodeOpen(false);
        return;
      }
      setPantry((current) => [createPantryItem(product.name, 'pantry', { barcode: product.barcode, brand: product.brand }), ...current]);
      setBarcodeOpen(false);
      announce(`${product.name} added.`);
    } catch {
      setBarcodeOpen(false);
      announce('Barcode lookup is unavailable right now. Try entering the item by name.');
    } finally {
      setBarcodeLoading(false);
    }
  }, [announce, barcodeLoading, pantry, setPantry]);

  const moveGroceryToKitchen = useCallback((item: GroceryItem, zone: StorageZone = 'pantry') => {
    if (!pantry.some((food) => food.normalized === item.normalized)) {
      setPantry((current) => [createPantryItem(item.name, zone), ...current]);
    }
    setGrocery((current) => current.filter((row) => row.id !== item.id));
    announce(`${item.name} moved to your ${zoneMeta[zone].label.toLowerCase()}.`);
  }, [announce, pantry, setGrocery, setPantry]);

  if (!profile.onboardingComplete) {
    return <Onboarding profile={profile} onComplete={setProfile} />;
  }

  if (cookStep !== null && selected) {
    return (
      <CookingMode
        match={selected}
        pantry={pantry}
        step={cookStep}
        onStep={setCookStep}
        ingredientsOpen={cookIngredientsOpen}
        onIngredientsOpen={setCookIngredientsOpen}
        servings={cookServings}
        onClose={() => {
          setCookStep(null);
          setCookIngredientsOpen(false);
        }}
      />
    );
  }

  return (
    <div className="app-shell">
      <main className="phone-app">
        {tab === 'home' && (
          <HomeScreen
            profile={profile}
            pantry={pantry}
            matches={matches}
            saved={saved}
            onAddIngredients={addIngredients}
            onSelect={setSelected}
            onToggleSaved={toggleSaved}
            onOpenBarcode={() => setBarcodeOpen(true)}
            onOpenPhoto={() => setPhotoOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
            onGoKitchen={() => setTab('kitchen')}
            onGoSaved={() => setTab('saved')}
            announce={announce}
          />
        )}
        {tab === 'kitchen' && (
          <KitchenScreen
            pantry={pantry}
            setPantry={setPantry}
            onAddIngredients={addIngredients}
            onOpenBarcode={() => setBarcodeOpen(true)}
            announce={announce}
          />
        )}
        {tab === 'grocery' && (
          <GroceryScreen
            grocery={grocery}
            setGrocery={setGrocery}
            onMoveToKitchen={moveGroceryToKitchen}
            announce={announce}
          />
        )}
        {tab === 'saved' && (
          <RecipesScreen
            matches={matches}
            saved={saved}
            onSelect={setSelected}
            onToggleSaved={toggleSaved}
          />
        )}
        <BottomNav tab={tab} onTab={setTab} groceryCount={grocery.filter((item) => !item.checked).length} />
      </main>

      {selected && (
        <RecipeSheet
          match={selected}
          pantry={pantry}
          saved={saved.includes(selected.recipe.id)}
          defaultServings={profile.householdSize || selected.recipe.servings}
          onClose={() => setSelected(null)}
          onToggleSaved={() => toggleSaved(selected.recipe.id)}
          onAddMissing={() => addMissingToGrocery(selected)}
          onCook={(servings) => {
            setCookServings(servings);
            setCookStep(0);
          }}
        />
      )}

      {settingsOpen && (
        <SettingsSheet
          profile={profile}
          setProfile={setProfile}
          onClose={() => setSettingsOpen(false)}
          onReset={() => {
            if (window.confirm('Clear the PantryCue data stored on this device?')) {
              setPantry([]);
              setGrocery([]);
              setSaved([]);
              setProfile(DEFAULT_PROFILE);
              setSettingsOpen(false);
            }
          }}
        />
      )}

      {barcodeOpen && (
        <Modal title={barcodeLoading ? 'Looking up food...' : 'Scan a barcode'} onClose={() => !barcodeLoading && setBarcodeOpen(false)}>
          <BarcodeScanner onDetected={handleBarcodeDetected} onCancel={() => setBarcodeOpen(false)} />
          {barcodeLoading && <div className="loading-row"><span className="spinner" /> Finding the product...</div>}
        </Modal>
      )}

      {photoOpen && (
        <PhotoScanBeta
          onClose={() => setPhotoOpen(false)}
          onAdd={(values, zone) => {
            addIngredients(values, zone);
            setPhotoOpen(false);
          }}
        />
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

function Onboarding({ profile, onComplete }: { profile: UserProfile; onComplete: (profile: UserProfile) => void }) {
  const [draft, setDraft] = useState(profile);

  const toggleDiet = (diet: DietaryPreference) => {
    setDraft((current) => ({
      ...current,
      diets: current.diets.includes(diet) ? current.diets.filter((value) => value !== diet) : [...current.diets, diet],
    }));
  };

  return (
    <div className="onboarding-shell">
      <div className="onboarding-card">
        <div className="onboarding-brand">
          <img src={`${import.meta.env.BASE_URL}pantrycue-logo.png`} alt="PantryCue" />
          <h1>PantryCue</h1>
          <p>Cook what you have.</p>
        </div>
        <div className="onboarding-intro">
          <span className="eyebrow">Welcome</span>
          <h2>Dinner starts with what is already in your kitchen.</h2>
          <p>Add food by typing, speaking, or scanning. PantryCue finds meals you can make now, useful substitutions, and the shortest grocery list for the rest.</p>
        </div>
        <div className="onboarding-fields">
          <label>
            <span>First name <small>optional</small></span>
            <input value={draft.firstName} maxLength={30} placeholder="What should we call you?" onChange={(event) => setDraft({ ...draft, firstName: event.target.value })} />
          </label>
          <label>
            <span>How many people do you usually cook for?</span>
            <div className="number-picker">
              {[1,2,3,4,5,6].map((number) => (
                <button key={number} className={draft.householdSize === number ? 'active' : ''} onClick={() => setDraft({ ...draft, householdSize: number })}>{number}{number === 6 ? '+' : ''}</button>
              ))}
            </div>
          </label>
          <div>
            <span className="field-heading">Food preferences <small>optional</small></span>
            <div className="choice-chips">
              {dietOptions.map((option) => (
                <button key={option.value} className={draft.diets.includes(option.value) ? 'choice-chip active' : 'choice-chip'} onClick={() => toggleDiet(option.value)}>
                  {draft.diets.includes(option.value) && <Icon name="check" size={14} />}{option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button className="primary-button full-width" onClick={() => onComplete({ ...draft, onboardingComplete: true })}>
          Start cooking <Icon name="chevron" size={18} />
        </button>
        <p className="privacy-note">Your pantry, favorites, and grocery list stay on this device in this family beta.</p>
      </div>
    </div>
  );
}

function HomeScreen({
  profile,
  pantry,
  matches,
  saved,
  onAddIngredients,
  onSelect,
  onToggleSaved,
  onOpenBarcode,
  onOpenPhoto,
  onOpenSettings,
  onGoKitchen,
  onGoSaved,
  announce,
}: {
  profile: UserProfile;
  pantry: PantryItem[];
  matches: RecipeMatch[];
  saved: string[];
  onAddIngredients: (items: string[], zone: StorageZone) => void;
  onSelect: (match: RecipeMatch) => void;
  onToggleSaved: (id: string) => void;
  onOpenBarcode: () => void;
  onOpenPhoto: () => void;
  onOpenSettings: () => void;
  onGoKitchen: () => void;
  onGoSaved: () => void;
  announce: (message: string) => void;
}) {
  const [entry, setEntry] = useState('');
  const [zone, setZone] = useState<StorageZone>('pantry');
  const [listening, setListening] = useState(false);
  const suggestions = useMemo(() => localIngredientSearch(entry, 6), [entry]);
  const ready = matches.filter((match) => match.missing.length === 0 && match.recipe.minutes <= profile.weeknightMinutes);
  const almost = matches.filter((match) => match.missing.length > 0 && match.missing.length <= 2).slice(0, 6);
  const useSoon = matches.filter((match) => match.usesSoon > 0).slice(0, 4);
  const topReady = ready.slice(0, 6);

  const submit = (value = entry) => {
    const parts = splitIngredientInput(value);
    onAddIngredients(parts.length ? parts : [value], zone);
    setEntry('');
  };

  const startVoice = () => {
    const win = window as typeof window & { SpeechRecognition?: any; webkitSpeechRecognition?: any };
    const Recognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!Recognition) {
      announce('Voice entry is not supported in this browser. You can type the ingredients instead.');
      return;
    }
    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      const parts = splitIngredientInput(transcript);
      onAddIngredients(parts.length ? parts : [transcript], zone);
    };
    recognition.onerror = () => announce('I could not hear that clearly. Try again or type the items.');
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  };

  return (
    <section className="screen home-screen">
      <header className="top-header">
        <Brand compact />
        <button className="avatar-button" onClick={onOpenSettings} aria-label="Open settings">
          {profile.firstName ? profile.firstName[0].toUpperCase() : <Icon name="settings" size={20} />}
        </button>
      </header>

      <div className="home-greeting">
        <span className="eyebrow">{greeting()}{profile.firstName ? `, ${profile.firstName}` : ''}</span>
        <h1>What can we make?</h1>
        <p>Tell PantryCue what you have. We will handle the ideas.</p>
      </div>

      <div className="ingredient-composer">
        <div className="composer-topline">
          <div className="zone-select mini">
            {(['pantry','fridge','freezer'] as StorageZone[]).map((value) => (
              <button key={value} onClick={() => setZone(value)} className={zone === value ? 'active' : ''}>
                <Icon name={zoneMeta[value].icon} size={15} /> {zoneMeta[value].label}
              </button>
            ))}
          </div>
        </div>
        <div className="composer-input-row">
          <Icon name="plus" size={20} />
          <input
            value={entry}
            onChange={(event) => setEntry(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && entry.trim() && submit()}
            placeholder="Chicken, rice, broccoli..."
            autoComplete="off"
            aria-label="Add ingredients"
          />
          {entry.trim() && <button className="composer-add" onClick={() => submit()}>Add</button>}
        </div>
        {entry.trim() && suggestions.length > 0 && (
          <div className="suggestion-list">
            {suggestions.map((suggestion) => <button key={suggestion} onClick={() => submit(suggestion)}>{displayIngredient(suggestion)}</button>)}
          </div>
        )}
        <div className="quick-actions">
          <button onClick={startVoice} className={listening ? 'listening' : ''}>
            <span className="quick-icon"><Icon name="mic" size={20} /></span>
            <span>{listening ? 'Listening...' : 'Speak'}</span>
          </button>
          <button onClick={onOpenBarcode}>
            <span className="quick-icon"><Icon name="barcode" size={20} /></span>
            <span>Barcode</span>
          </button>
          <button onClick={onOpenPhoto}>
            <span className="quick-icon"><Icon name="camera" size={20} /></span>
            <span>Photo + confirm</span><small>Beta</small>
          </button>
        </div>
      </div>

      <button className="kitchen-summary" onClick={onGoKitchen}>
        <span className="summary-icon"><Icon name="kitchen" size={21} /></span>
        <span><strong>{pantry.length} item{pantry.length === 1 ? '' : 's'} in your kitchen</strong><small>{pantry.length ? `${pantry.filter((item) => item.useSoon).length} marked use soon` : 'Add a few foods to get personalized matches'}</small></span>
        <Icon name="chevron" size={19} />
      </button>

      {profile.diets.length > 0 && (
        <div className="dietary-banner">
          <Icon name="check" size={18} />
          <span><strong>Cooking for {profile.diets.map(dietLabel).join(' + ')}</strong><small>Compatible meals are adjusted for you. PantryCue still requires clearly labeled specialty products where needed.</small></span>
        </div>
      )}

      {pantry.length === 0 ? (
        <EmptyHome onTry={(items) => onAddIngredients(items, 'pantry')} />
      ) : (
        <>
          {useSoon.length > 0 && (
            <RecipeSection title="Use these up" subtitle="Meals that use food you marked use soon" action="See recipes" onAction={onGoSaved}>
              {useSoon.map((match) => <RecipeCard key={match.recipe.id} match={match} saved={saved.includes(match.recipe.id)} onOpen={() => onSelect(match)} onToggleSaved={() => onToggleSaved(match.recipe.id)} compact />)}
            </RecipeSection>
          )}

          <RecipeSection
            title="Make it now"
            subtitle={topReady.length ? `${topReady.length} great match${topReady.length === 1 ? '' : 'es'} with what you have` : 'No complete matches yet'}
            action="Browse all"
            onAction={onGoSaved}
          >
            {topReady.length ? topReady.map((match) => <RecipeCard key={match.recipe.id} match={match} saved={saved.includes(match.recipe.id)} onOpen={() => onSelect(match)} onToggleSaved={() => onToggleSaved(match.recipe.id)} />) : <NoMatches type="ready" />}
          </RecipeSection>

          {almost.length > 0 && (
            <RecipeSection title="Almost there" subtitle="One or two groceries away" action="Browse all" onAction={onGoSaved}>
              {almost.slice(0, 4).map((match) => <RecipeCard key={match.recipe.id} match={match} saved={saved.includes(match.recipe.id)} onOpen={() => onSelect(match)} onToggleSaved={() => onToggleSaved(match.recipe.id)} />)}
            </RecipeSection>
          )}
        </>
      )}

      <div className="catalog-note">
        <Icon name="sparkle" size={19} />
        <div><strong>{recipeCount} original family-beta recipes</strong><span>Ingredient entry accepts anything, while built-in normalization and optional food databases help PantryCue recognize common variations.</span></div>
      </div>
    </section>
  );
}

function EmptyHome({ onTry }: { onTry: (items: string[]) => void }) {
  return (
    <div className="empty-home">
      <div className="empty-illustration"><span>🥕</span><span>🍗</span><span>🥦</span></div>
      <h2>Start with five things you can see.</h2>
      <p>You do not need to inventory the whole kitchen. Add a few ingredients and PantryCue will immediately begin matching meals.</p>
      <button className="secondary-button" onClick={() => onTry(['Chicken breast','Rice','Broccoli','Cheddar cheese','Tortillas'])}>Try a sample kitchen</button>
    </div>
  );
}

function RecipeSection({ title, subtitle, action, onAction, children }: { title: string; subtitle: string; action?: string; onAction?: () => void; children: React.ReactNode }) {
  return (
    <section className="recipe-section">
      <div className="section-heading">
        <div><h2>{title}</h2><p>{subtitle}</p></div>
        {action && onAction && <button onClick={onAction}>{action}</button>}
      </div>
      <div className="recipe-stack">{children}</div>
    </section>
  );
}

function NoMatches({ type }: { type: 'ready' | 'saved' }) {
  return (
    <div className="empty-inline">
      <Icon name={type === 'ready' ? 'kitchen' : 'heart'} size={28} />
      <div><strong>{type === 'ready' ? 'Keep adding ingredients' : 'No saved recipes yet'}</strong><span>{type === 'ready' ? 'Your best matches will appear here as your kitchen fills up.' : 'Tap the heart on any recipe you want to come back to.'}</span></div>
    </div>
  );
}

function KitchenScreen({ pantry, setPantry, onAddIngredients, onOpenBarcode, announce }: {
  pantry: PantryItem[];
  setPantry: React.Dispatch<React.SetStateAction<PantryItem[]>>;
  onAddIngredients: (items: string[], zone: StorageZone) => void;
  onOpenBarcode: () => void;
  announce: (message: string) => void;
}) {
  const [zone, setZone] = useState<StorageZone>('pantry');
  const [search, setSearch] = useState('');
  const [entry, setEntry] = useState('');
  const filtered = pantry.filter((item) => item.zone === zone && (!search.trim() || item.name.toLowerCase().includes(search.toLowerCase())));
  const suggestions = localIngredientSearch(entry, 5);

  const submit = (value = entry) => {
    const parts = splitIngredientInput(value);
    onAddIngredients(parts.length ? parts : [value], zone);
    setEntry('');
  };

  return (
    <section className="screen">
      <header className="page-header">
        <div><span className="eyebrow">My kitchen</span><h1>What you have</h1></div>
        <span className="count-bubble">{pantry.length}</span>
      </header>

      <div className="zone-select">
        {(['pantry','fridge','freezer'] as StorageZone[]).map((value) => {
          const count = pantry.filter((item) => item.zone === value).length;
          return <button key={value} className={zone === value ? 'active' : ''} onClick={() => setZone(value)}><Icon name={zoneMeta[value].icon} size={18} /><span>{zoneMeta[value].label}</span><small>{count}</small></button>;
        })}
      </div>

      <div className="kitchen-add-card">
        <div className="composer-input-row kitchen-input">
          <Icon name="plus" size={19} />
          <input value={entry} onChange={(event) => setEntry(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && entry.trim() && submit()} placeholder={`Add to ${zoneMeta[zone].label.toLowerCase()}`} />
          {entry.trim() && <button className="composer-add" onClick={() => submit()}>Add</button>}
        </div>
        {entry.trim() && suggestions.length > 0 && <div className="suggestion-list compact">{suggestions.map((value) => <button key={value} onClick={() => submit(value)}>{displayIngredient(value)}</button>)}</div>}
        <button className="scan-link" onClick={onOpenBarcode}><Icon name="barcode" size={17} /> Scan a packaged food</button>
      </div>

      <div className="search-box">
        <Icon name="search" size={19} />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${zoneMeta[zone].label.toLowerCase()}`} />
        {search && <button onClick={() => setSearch('')} aria-label="Clear search"><Icon name="close" size={17} /></button>}
      </div>

      <div className="kitchen-list">
        {filtered.length ? filtered.map((item) => (
          <article className="kitchen-item" key={item.id}>
            <button className={item.useSoon ? 'food-check use-soon' : 'food-check'} onClick={() => {
              setPantry((current) => current.map((row) => row.id === item.id ? { ...row, useSoon: !row.useSoon } : row));
              announce(item.useSoon ? `${item.name} is no longer marked use soon.` : `${item.name} marked use soon.`);
            }} aria-label={item.useSoon ? 'Remove use soon flag' : 'Mark use soon'}>
              {item.useSoon ? <Icon name="flame" size={17} /> : <span />}
            </button>
            <div className="kitchen-item-copy"><strong>{item.name}</strong><span>{item.brand ? `${item.brand} · ` : ''}{item.useSoon ? 'Use soon' : zoneMeta[item.zone].label}</span></div>
            <button className="delete-button" onClick={() => setPantry((current) => current.filter((row) => row.id !== item.id))} aria-label={`Remove ${item.name}`}><Icon name="trash" size={18} /></button>
          </article>
        )) : (
          <div className="large-empty"><Icon name={zoneMeta[zone].icon} size={34} /><h3>{search ? 'No matching foods' : `${zoneMeta[zone].label} is empty`}</h3><p>{search ? 'Try a different search.' : 'Add foods above as you notice them. You do not need to do everything at once.'}</p></div>
        )}
      </div>

      {pantry.length > 0 && <p className="use-soon-help"><Icon name="flame" size={15} /> Tap the circle beside a food when you want PantryCue to prioritize using it soon.</p>}
    </section>
  );
}

function GroceryScreen({ grocery, setGrocery, onMoveToKitchen, announce }: {
  grocery: GroceryItem[];
  setGrocery: React.Dispatch<React.SetStateAction<GroceryItem[]>>;
  onMoveToKitchen: (item: GroceryItem, zone?: StorageZone) => void;
  announce: (message: string) => void;
}) {
  const [entry, setEntry] = useState('');
  const unchecked = grocery.filter((item) => !item.checked);
  const checked = grocery.filter((item) => item.checked);

  const add = () => {
    const parts = splitIngredientInput(entry);
    const existing = new Set(grocery.map((item) => item.normalized));
    const additions = (parts.length ? parts : [entry]).filter((name) => !existing.has(normalizeIngredient(name))).map((name) => createGroceryItem(name));
    if (additions.length) setGrocery((current) => [...current, ...additions]);
    setEntry('');
  };

  return (
    <section className="screen">
      <header className="page-header">
        <div><span className="eyebrow">Shopping</span><h1>Grocery list</h1></div>
        <span className="count-bubble">{unchecked.length}</span>
      </header>

      <div className="grocery-progress">
        <div><strong>{unchecked.length ? `${unchecked.length} left to grab` : grocery.length ? 'All checked off' : 'Your list is empty'}</strong><span>{grocery.length ? `${checked.length} of ${grocery.length} complete` : 'Missing recipe ingredients can land here in one tap.'}</span></div>
        {grocery.length > 0 && <div className="progress-ring" style={{ '--progress': `${Math.round((checked.length / grocery.length) * 100)}%` } as React.CSSProperties}><span>{Math.round((checked.length / grocery.length) * 100)}%</span></div>}
      </div>

      <div className="grocery-add">
        <Icon name="plus" size={19} />
        <input value={entry} onChange={(event) => setEntry(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && entry.trim() && add()} placeholder="Add an item" />
        <button onClick={add} disabled={!entry.trim()}>Add</button>
      </div>

      <div className="grocery-list">
        {unchecked.map((item) => <GroceryRow key={item.id} item={item} setGrocery={setGrocery} onMoveToKitchen={onMoveToKitchen} />)}
        {checked.length > 0 && (
          <div className="checked-section">
            <div className="checked-heading"><span>Checked off</span><button onClick={() => { setGrocery((current) => current.filter((item) => !item.checked)); announce('Checked items cleared.'); }}>Clear</button></div>
            {checked.map((item) => <GroceryRow key={item.id} item={item} setGrocery={setGrocery} onMoveToKitchen={onMoveToKitchen} />)}
          </div>
        )}
        {!grocery.length && <div className="large-empty"><Icon name="cart" size={34} /><h3>Nothing to buy yet</h3><p>When a recipe is close, tap “Add missing” and PantryCue will build the short list for you.</p></div>}
      </div>
    </section>
  );
}

function GroceryRow({ item, setGrocery, onMoveToKitchen }: {
  item: GroceryItem;
  setGrocery: React.Dispatch<React.SetStateAction<GroceryItem[]>>;
  onMoveToKitchen: (item: GroceryItem, zone?: StorageZone) => void;
}) {
  const [moveOpen, setMoveOpen] = useState(false);
  return (
    <div className={`grocery-row ${item.checked ? 'checked' : ''}`}>
      <button className="grocery-check" onClick={() => setGrocery((current) => current.map((row) => row.id === item.id ? { ...row, checked: !row.checked } : row))} aria-label={item.checked ? 'Uncheck item' : 'Check item'}>{item.checked && <Icon name="check" size={16} />}</button>
      <span>{item.name}</span>
      <button className="grocery-more" onClick={() => setMoveOpen((value) => !value)} aria-label="Item options"><Icon name="more" size={18} /></button>
      {moveOpen && <div className="row-popover"><span>Move to</span>{(['pantry','fridge','freezer'] as StorageZone[]).map((zone) => <button key={zone} onClick={() => onMoveToKitchen(item, zone)}><Icon name={zoneMeta[zone].icon} size={15} /> {zoneMeta[zone].label}</button>)}<button className="danger" onClick={() => setGrocery((current) => current.filter((row) => row.id !== item.id))}><Icon name="trash" size={15} /> Delete</button></div>}
    </div>
  );
}

function RecipesScreen({ matches, saved, onSelect, onToggleSaved }: {
  matches: RecipeMatch[];
  saved: string[];
  onSelect: (match: RecipeMatch) => void;
  onToggleSaved: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [onlyReady, setOnlyReady] = useState(false);
  const [maxMinutes, setMaxMinutes] = useState(60);
  const filtered = matches.filter((match) => {
    const haystack = `${match.recipe.title} ${match.recipe.summary} ${match.recipe.tags.join(' ')} ${match.recipe.ingredients.map((ingredient) => ingredient.name).join(' ')}`.toLowerCase();
    return (!query.trim() || haystack.includes(query.toLowerCase())) && (!onlyReady || match.missing.length === 0) && match.recipe.minutes <= maxMinutes;
  });
  const savedMatches = filtered.filter((match) => saved.includes(match.recipe.id));

  return (
    <section className="screen">
      <header className="page-header"><div><span className="eyebrow">Ideas</span><h1>Recipes</h1></div><span className="count-bubble">{filtered.length}</span></header>
      <div className="search-box recipe-search"><Icon name="search" size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search meals or ingredients" />{query && <button onClick={() => setQuery('')}><Icon name="close" size={17} /></button>}</div>
      <div className="recipe-filters">
        <button className={onlyReady ? 'active' : ''} onClick={() => setOnlyReady((value) => !value)}><Icon name="check" size={15} /> Make now</button>
        <label><Icon name="clock" size={15} /><select value={maxMinutes} onChange={(event) => setMaxMinutes(Number(event.target.value))}><option value={20}>20 min</option><option value={30}>30 min</option><option value={45}>45 min</option><option value={60}>60 min</option><option value={999}>Any time</option></select></label>
      </div>

      {!query && saved.length > 0 && (
        <section className="recipe-section saved-section">
          <div className="section-heading"><div><h2>Saved</h2><p>Your favorites in one place</p></div></div>
          <div className="recipe-stack">{savedMatches.length ? savedMatches.map((match) => <RecipeCard key={match.recipe.id} match={match} saved onOpen={() => onSelect(match)} onToggleSaved={() => onToggleSaved(match.recipe.id)} compact />) : <NoMatches type="saved" />}</div>
        </section>
      )}

      <section className="recipe-section">
        <div className="section-heading"><div><h2>{query ? 'Search results' : 'All recipes'}</h2><p>Sorted by what best matches your kitchen</p></div></div>
        <div className="recipe-stack">
          {filtered.length ? filtered.map((match) => <RecipeCard key={match.recipe.id} match={match} saved={saved.includes(match.recipe.id)} onOpen={() => onSelect(match)} onToggleSaved={() => onToggleSaved(match.recipe.id)} compact />) : <div className="large-empty"><Icon name="search" size={32} /><h3>No recipes found</h3><p>Try a different search or loosen the filters.</p></div>}
        </div>
      </section>
    </section>
  );
}

function RecipeSheet({ match, pantry, saved, defaultServings, onClose, onToggleSaved, onAddMissing, onCook }: {
  match: RecipeMatch;
  pantry: PantryItem[];
  saved: boolean;
  defaultServings: number;
  onClose: () => void;
  onToggleSaved: () => void;
  onAddMissing: () => void;
  onCook: (servings: number) => void;
}) {
  const [servings, setServings] = useState(Math.max(1, defaultServings));
  const missingSet = new Set(match.missing.map((ingredient) => normalizeIngredient(ingredient.name)));
  const guide = useMemo(() => buildCookingGuide(match.recipe), [match.recipe]);
  const equipment = useMemo(() => inferEquipment(match.recipe), [match.recipe]);

  return (
    <div className="recipe-detail-layer">
      <article className="recipe-detail">
        <header className="recipe-detail-top">
          <button className="floating-button" onClick={onClose} aria-label="Close recipe"><Icon name="back" size={21} /></button>
          <div className="recipe-hero-art"><span>{match.recipe.tags.some((tag) => tag.toLowerCase().includes('breakfast')) ? '🍳' : '🍽️'}</span></div>
          <button className={`floating-button save ${saved ? 'active' : ''}`} onClick={onToggleSaved} aria-label="Save recipe"><Icon name="heart" size={21} fill={saved ? 'currentColor' : 'none'} /></button>
        </header>
        <div className="recipe-detail-body">
          <div className="recipe-title-block">
            <span className={match.missing.length === 0 ? 'status-pill ready' : 'status-pill almost'}>{match.missing.length === 0 ? <><Icon name="check" size={13} /> {Object.keys(match.availableSubstitutions).length ? 'Ready with a swap' : 'You have everything'}</> : `Missing ${match.missing.length}`}</span>
            <h1>{match.recipe.title}</h1>
            <p>{match.recipe.summary}</p>
            <div className="detail-meta"><span><Icon name="clock" size={16} /> {match.recipe.minutes} min</span><span><Icon name="flame" size={16} /> {match.recipe.difficulty}</span><span>{match.recipe.cuisine}</span></div>
          </div>

          {match.recipe.adaptedFor && match.recipe.adaptedFor.length > 0 && (
            <section className="dietary-fit-card">
              <Icon name="check" size={19} />
              <div><strong>Adjusted for {match.recipe.adaptedFor.map(dietLabel).join(' + ')}</strong><span>Ingredient names and matching have been updated for your food preferences.</span></div>
              {match.recipe.dietaryNotes?.map((note) => <p key={note}>{note}</p>)}
            </section>
          )}

          <div className="serving-control"><span>Servings</span><div><button onClick={() => setServings((value) => Math.max(1, value - 1))}>−</button><strong>{servings}</strong><button onClick={() => setServings((value) => Math.min(12, value + 1))}>+</button></div></div>

          <section className="detail-section">
            <div className="detail-section-heading"><h2>Ingredients</h2><span>{match.available.length} in your kitchen</span></div>
            <div className="ingredient-list">
              {match.recipe.ingredients.map((ingredient) => {
                const key = normalizeIngredient(ingredient.name);
                const hasDirect = pantryHas(pantry, ingredient);
                const requiredMissing = missingSet.has(key);
                const substitutes = availableSubstitutes(pantry, ingredient);
                const usingSub = !hasDirect && !requiredMissing && match.availableSubstitutions[key]?.length > 0;
                const optionalMissing = ingredient.optional && !hasDirect && !usingSub;
                return (
                  <div className={`ingredient-row ${requiredMissing ? 'missing' : ''} ${optionalMissing ? 'optional-missing' : ''}`} key={`${ingredient.name}-${ingredient.amount}`}>
                    <span className="ingredient-state">{requiredMissing ? '!' : optionalMissing ? '○' : <Icon name="check" size={14} />}</span>
                    <div><strong>{ingredient.name}{ingredient.optional ? <small> optional</small> : ''}</strong><span>{scaleAmount(ingredient.amount, match.recipe.servings, servings)}</span>
                    {usingSub && <em>Use {match.availableSubstitutions[key][0].label}</em>}
                    {requiredMissing && substitutes.length > 0 && <em>Swap: {substitutes[0].label}</em>}</div>
                  </div>
                );
              })}
            </div>
            {match.missing.length > 0 && <button className="secondary-button full-width" onClick={onAddMissing}><Icon name="cart" size={18} /> Add {match.missing.length} missing item{match.missing.length === 1 ? '' : 's'} to grocery</button>}
          </section>

          <section className="detail-section substitution-section">
            <div className="detail-section-heading"><h2>Smart swaps</h2><span>Based on your kitchen</span></div>
            <SubstitutionSummary match={match} pantry={pantry} />
          </section>

          <section className="detail-section">
            <div className="detail-section-heading"><h2>Equipment</h2><span>Set this out first</span></div>
            <div className="equipment-list">{equipment.map((item) => <span key={item}>{item}</span>)}</div>
          </section>

          <section className="detail-section steps-preview">
            <div className="detail-section-heading"><h2>How to make it</h2><span>{guide.length} guided steps</span></div>
            {guide.slice(0, 3).map((guideStep, index) => <div className="step-preview" key={`${guideStep.title}-${index}`}><span>{index + 1}</span><p><strong>{guideStep.title}.</strong> {guideStep.instruction}</p></div>)}
            {guide.length > 3 && <p className="more-steps">+ {guide.length - 3} more detailed steps in cooking mode</p>}
          </section>
        </div>
        <div className="recipe-detail-footer"><button className="primary-button full-width" onClick={() => onCook(servings)}>Start cooking <Icon name="chevron" size={18} /></button></div>
      </article>
    </div>
  );
}

function SubstitutionSummary({ match }: { match: RecipeMatch; pantry: PantryItem[] }) {
  const rows = Object.entries(match.availableSubstitutions)
    .map(([key, options]) => ({
      ingredient: match.recipe.ingredients.find((ingredient) => normalizeIngredient(ingredient.name) === key),
      options,
    }))
    .filter((row): row is { ingredient: RecipeIngredient; options: typeof row.options } => Boolean(row.ingredient && row.options.length));

  if (!rows.length) return <div className="sub-empty"><Icon name="sparkle" size={19} /><span>No substitutions are needed for this recipe with your current kitchen.</span></div>;
  return <div className="swap-list">{rows.slice(0, 4).map(({ ingredient, options }) => <div className="swap-card" key={ingredient.name}><div><span>Instead of</span><strong>{ingredient.name}</strong></div><Icon name="chevron" size={17} /><div><span>Use what you have</span><strong>{options[0].label}</strong>{options[0].note && <small>{options[0].note}</small>}</div></div>)}</div>;
}

function CookingMode({ match, pantry, step, onStep, ingredientsOpen, onIngredientsOpen, servings, onClose }: {
  match: RecipeMatch;
  pantry: PantryItem[];
  step: number;
  onStep: (step: number) => void;
  ingredientsOpen: boolean;
  onIngredientsOpen: (open: boolean) => void;
  servings: number;
  onClose: () => void;
}) {
  const guide = useMemo(() => buildCookingGuide(match.recipe), [match.recipe]);
  const total = guide.length;
  const progress = ((step + 1) / total) * 100;
  const current = guide[Math.min(step, total - 1)];

  return (
    <main className="cooking-mode">
      <header className="cooking-header">
        <button onClick={onClose} aria-label="Exit cooking mode"><Icon name="close" size={20} /></button>
        <div><span>Cooking</span><strong>{match.recipe.title}</strong></div>
        <button onClick={() => onIngredientsOpen(true)} aria-label="View ingredients"><Icon name="list" size={20} /></button>
      </header>
      <div className="cook-progress"><span style={{ width: `${progress}%` }} /></div>
      <section className="cook-step">
        <div className="cook-phase">{current.phase}</div>
        <div className="cook-step-number"><span>Step</span><strong>{step + 1}</strong><small>of {total}</small></div>
        <h1>{current.title}</h1>
        <p>{current.instruction}</p>
        {current.tip && <aside className="cook-tip"><Icon name="info" size={18} /><span>{current.tip}</span></aside>}
        {step === total - 1 && <div className="finish-note"><Icon name="sparkle" size={22} /><strong>That is it.</strong><span>Plate it up and enjoy.</span></div>}
      </section>
      <footer className="cooking-footer">
        <button className="cook-secondary" onClick={() => onStep(Math.max(0, step - 1))} disabled={step === 0}><Icon name="back" size={19} /> Previous</button>
        {step < total - 1 ? <button className="cook-primary" onClick={() => onStep(step + 1)}>Next <Icon name="chevron" size={19} /></button> : <button className="cook-primary" onClick={onClose}>Finish <Icon name="check" size={19} /></button>}
      </footer>
      {ingredientsOpen && (
        <Modal title="Ingredients" onClose={() => onIngredientsOpen(false)}>
          <div className="cook-ingredient-list">{match.recipe.ingredients.map((ingredient) => {
            const has = pantryHas(pantry, ingredient);
            return <div key={ingredient.name}><span className={has ? 'have' : ''}>{has && <Icon name="check" size={13} />}</span><strong>{ingredient.name}</strong><small>{scaleAmount(ingredient.amount, match.recipe.servings, servings)}</small></div>;
          })}</div>
        </Modal>
      )}
    </main>
  );
}

function SettingsSheet({ profile, setProfile, onClose, onReset }: {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onClose: () => void;
  onReset: () => void;
}) {
  const toggleDiet = (diet: DietaryPreference) => setProfile((current) => ({ ...current, diets: current.diets.includes(diet) ? current.diets.filter((item) => item !== diet) : [...current.diets, diet] }));
  return (
    <Modal title="Settings" onClose={onClose}>
      <div className="settings-group"><label>First name<input value={profile.firstName} onChange={(event) => setProfile((current) => ({ ...current, firstName: event.target.value }))} /></label></div>
      <div className="settings-group"><span className="field-heading">Usually cooking for</span><div className="number-picker compact">{[1,2,3,4,5,6].map((number) => <button key={number} className={profile.householdSize === number ? 'active' : ''} onClick={() => setProfile((current) => ({ ...current, householdSize: number }))}>{number}{number === 6 ? '+' : ''}</button>)}</div></div>
      <div className="settings-group"><span className="field-heading">Weeknight time target</span><div className="time-chips">{[20,30,45,60].map((minutes) => <button key={minutes} className={profile.weeknightMinutes === minutes ? 'active' : ''} onClick={() => setProfile((current) => ({ ...current, weeknightMinutes: minutes }))}>{minutes} min</button>)}</div></div>
      <div className="settings-group"><span className="field-heading">Food preferences</span><div className="choice-chips">{dietOptions.map((option) => <button key={option.value} className={profile.diets.includes(option.value) ? 'choice-chip active' : 'choice-chip'} onClick={() => toggleDiet(option.value)}>{profile.diets.includes(option.value) && <Icon name="check" size={14} />}{option.label}</button>)}</div></div>
      <div className="settings-about"><Brand /><p>Version {APP_VERSION} family beta with {recipeCount} original PantryCue recipes plus dietary adaptations. Pantry staples currently assumed: {pantryStaples.slice(0, 7).join(', ')}, and a few other basics.</p></div>
      <button className="danger-button" onClick={onReset}><Icon name="trash" size={17} /> Reset this device</button>
    </Modal>
  );
}

function PhotoScanBeta({ onClose, onAdd }: { onClose: () => void; onAdd: (items: string[], zone: StorageZone) => void }) {
  const [preview, setPreview] = useState('');
  const [entry, setEntry] = useState('');
  const [zone, setZone] = useState<StorageZone>('fridge');
  const [error, setError] = useState('');

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const choosePhoto = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose a photo file from your camera or photo library.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('That photo is larger than 15 MB. Choose a smaller image and try again.');
      return;
    }
    setError('');
    setPreview(URL.createObjectURL(file));
  };

  return (
    <Modal title="Photo + confirm beta" onClose={onClose}>
      <div className="photo-beta">
        <p className="inline-note photo-beta-note"><Icon name="info" size={17} /> This family beta does not automatically identify food from a photo yet. The photo stays on this device and gives you a reference while you confirm each item, so PantryCue never guesses incorrectly.</p>
        {preview ? <img src={preview} alt="Kitchen photo ready for item confirmation" /> : <div className="photo-placeholder"><Icon name="camera" size={38} /><strong>Photograph your fridge or pantry</strong><span>Take one clear photo, then list the foods you see before anything is added.</span></div>}
        <label className="secondary-button full-width file-input"><Icon name="camera" size={18} /> {preview ? 'Take a different photo' : 'Take or choose a photo'}<input type="file" accept="image/*" capture="environment" onChange={(event) => {
          choosePhoto(event.target.files?.[0]);
          event.currentTarget.value = '';
        }} /></label>
        {error && <p className="inline-note" role="alert"><Icon name="info" size={17} /> {error}</p>}
        {preview && <div className="photo-manual-confirm"><div className="beta-label"><Icon name="sparkle" size={15} /> Confirm before adding</div><h3>What foods can you see?</h3><p>Type the foods separated by commas. Include important labels such as “gluten-free pasta” or “dairy-free milk” so dietary matching stays accurate.</p><div className="zone-select mini">{(['fridge','pantry','freezer'] as StorageZone[]).map((value) => <button key={value} className={zone === value ? 'active' : ''} onClick={() => setZone(value)}><Icon name={zoneMeta[value].icon} size={14} /> {zoneMeta[value].label}</button>)}</div><textarea value={entry} onChange={(event) => setEntry(event.target.value)} placeholder="Gluten-free pasta, ground beef, marinara sauce..." /><button className="primary-button full-width" disabled={!entry.trim()} onClick={() => onAdd(splitIngredientInput(entry), zone)}>Confirm and add</button></div>}
      </div>
    </Modal>
  );
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
