export type StorageZone = 'pantry' | 'fridge' | 'freezer';
export type Tab = 'home' | 'kitchen' | 'grocery' | 'saved';
export type DietaryPreference =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'pork-free'
  | 'nut-free';

export interface UserProfile {
  firstName: string;
  householdSize: number;
  diets: DietaryPreference[];
  weeknightMinutes: number;
  onboardingComplete: boolean;
}

export interface PantryItem {
  id: string;
  name: string;
  normalized: string;
  zone: StorageZone;
  quantity?: string;
  barcode?: string;
  brand?: string;
  useSoon?: boolean;
  addedAt: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  normalized: string;
  checked: boolean;
  sourceRecipeId?: string;
  createdAt: string;
}

export interface SubstituteOption {
  label: string;
  requires: string[];
  note?: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  aliases?: string[];
  optional?: boolean;
  pantryStaple?: boolean;
  substitutes?: SubstituteOption[];
}

export interface Recipe {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  servings: number;
  difficulty: 'Easy' | 'Moderate';
  cuisine: string;
  tags: string[];
  diets: DietaryPreference[];
  ingredients: RecipeIngredient[];
  steps: string[];
  equipment?: string[];
}

export interface RecipeMatch {
  recipe: Recipe;
  available: RecipeIngredient[];
  missing: RecipeIngredient[];
  optionalMissing: RecipeIngredient[];
  availableSubstitutions: Record<string, SubstituteOption[]>;
  score: number;
  pantryScore: number;
  usesSoon: number;
}

export interface BarcodeProduct {
  barcode: string;
  name: string;
  brand?: string;
  imageUrl?: string;
}

export interface IngredientSearchResult {
  name: string;
  source: 'local' | 'usda';
}
