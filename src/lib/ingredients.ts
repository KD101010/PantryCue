import { categoryKeywords, ingredientAliases, ingredientCatalog } from '../data/ingredientCatalog';

function clean(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[®™]/g, '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\b(organic|natural|fresh|frozen|canned|jarred|shredded|sliced|diced|chopped|large|small|medium|pack|package|pkg)\b/g, ' ')
    .replace(/[^a-z0-9%]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const dietaryQualifierBase = /\b(pasta|spaghetti|fettuccine|macaroni|noodles?|lasagna|bread|buns?|bagels?|tortillas?|pita|naan|flour|breadcrumbs?|panko|crackers?|cereal|oats?|granola|soy sauce|teriyaki sauce|worcestershire sauce|taco seasoning|enchilada sauce|biscuits?|milk|buttermilk|cream|butter|cheese|cheddar|mozzarella|parmesan|ricotta|yogurt|sour cream|ranch|caesar|alfredo|mayonnaise|mayo)\b/;

function withoutDietaryQualifier(value: string): string {
  if (/^(certified\s+)?(gluten[ -]?free|gf)\s+(pasta\s+)?sauce$/.test(value)) return 'pasta sauce';
  const stripped = value
    .replace(/\b(certified\s+)?(gluten[ -]?free|gf|dairy[ -]?free|non[ -]?dairy|vegan|plant[ -]?based)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return dietaryQualifierBase.test(stripped) ? stripped : value;
}

const aliasEntries = Object.entries(ingredientAliases)
  .map(([alias, canonical]) => [clean(alias), canonical] as const)
  .sort((a, b) => b[0].length - a[0].length);
const normalizationCache = new Map<string, string>();

function rememberNormalization(input: string, result: string): string {
  if (normalizationCache.size >= 2000) normalizationCache.clear();
  normalizationCache.set(input, result);
  return result;
}

export function normalizeIngredient(value: string): string {
  const normalized = clean(value);
  if (!normalized) return '';
  const cached = normalizationCache.get(normalized);
  if (cached !== undefined) return cached;

  const matchable = withoutDietaryQualifier(normalized);

  const exact = ingredientAliases[matchable];
  if (exact) return rememberNormalization(normalized, exact);

  for (const [alias, canonical] of aliasEntries) {
    if (matchable === alias || matchable.includes(` ${alias} `) || matchable.startsWith(`${alias} `) || matchable.endsWith(` ${alias}`)) {
      return rememberNormalization(normalized, canonical);
    }
  }

  for (const [canonical, keywords] of categoryKeywords) {
    if (keywords.some((keyword) => matchable.includes(clean(keyword)))) return rememberNormalization(normalized, canonical);
  }

  const catalogExact = ingredientCatalog.find((ingredient) => clean(ingredient) === matchable);
  if (catalogExact) return rememberNormalization(normalized, catalogExact);

  return rememberNormalization(normalized, matchable
    .replace(/\bbreasts\b/g, 'breast')
    .replace(/\btomatoes\b/g, 'tomato')
    .trim());
}

export function ingredientVariantKey(value: string): string {
  const normalized = clean(value);
  const qualifiers = [
    /\b(gluten[ -]?free|gf)\b/.test(normalized) ? 'gf' : '',
    /\b(dairy[ -]?free|non[ -]?dairy)\b/.test(normalized) ? 'df' : '',
    /\bvegan\b/.test(normalized) ? 'vegan' : '',
    /\bvegetarian\b/.test(normalized) ? 'vegetarian' : '',
  ].filter(Boolean).join(':');
  return `${normalizeIngredient(value)}::${qualifiers}`;
}

export function displayIngredient(value: string): string {
  return value
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function splitIngredientInput(value: string): string[] {
  const cleaned = value
    .replace(/\b(i have|i've got|ive got|we have|there is|there are|some|a little|a bit of)\b/gi, ' ')
    .replace(/\b(and then|plus|also)\b/gi, ',')
    .replace(/\band\b/gi, ',');

  return cleaned
    .split(/[,;\n]+/)
    .map((part) => part
      .replace(/^\s*\d+(?:\.\d+)?\s*(?:lb|lbs|oz|ounces?|cups?|cans?|packages?|packs?|bags?|bottles?|jars?|pieces?|pieces of)?\s*/i, '')
      .trim())
    .filter((part) => part.length > 1);
}

export function localIngredientSearch(query: string, limit = 8): string[] {
  const q = clean(query);
  if (q.length < 1) return [];
  const scored = ingredientCatalog
    .map((name) => {
      const n = clean(name);
      let score = 0;
      if (n === q) score = 100;
      else if (n.startsWith(q)) score = 80;
      else if (n.includes(q)) score = 60;
      else if (q.split(' ').every((part) => n.includes(part))) score = 40;
      return { name, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.name.length - b.name.length);

  return Array.from(new Set(scored.map((row) => row.name))).slice(0, limit);
}
