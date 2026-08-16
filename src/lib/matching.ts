import { pantryStaples } from '../data/ingredientCatalog';
import { substitutionLibrary } from '../data/substitutions';
import type { DietaryPreference, PantryItem, Recipe, RecipeIngredient, RecipeMatch, SubstituteOption } from '../types';
import { adaptRecipeForPreferences } from './dietary';
import { normalizeIngredient } from './ingredients';

const assumedStaples = new Set(pantryStaples.map(normalizeIngredient));

export function ingredientKeys(ingredient: RecipeIngredient): string[] {
  return [ingredient.name, ...(ingredient.aliases ?? [])].map(normalizeIngredient);
}

function itemMeetsDietaryRequirements(item: PantryItem, ingredient: RecipeIngredient): boolean {
  const requirements = ingredient.dietaryRequirements ?? [];
  const name = item.name.toLowerCase();
  return requirements.every((requirement) => {
    if (requirement === 'gluten-free') {
      return /\b(gluten[ -]?free|gf)\b/.test(name) || /\b(rice noodles?|corn tortillas?)\b/.test(name);
    }
    if (requirement === 'dairy-free') {
      return /\b(dairy[ -]?free|non[ -]?dairy|vegan|plant[ -]?based|oat milk|soy milk|rice milk|coconut milk)\b/.test(name);
    }
    if (requirement === 'nut-free') return !/\b(peanut|almond|cashew|walnut|pecan|hazelnut|pistachio|macadamia)\b/.test(name);
    if (requirement === 'vegetarian') return /\bvegetarian\b/.test(name);
    if (requirement === 'vegan') return /\bvegan\b/.test(name);
    return true;
  });
}

function actualPantryHas(items: PantryItem[], ingredient: RecipeIngredient): boolean {
  const keys = new Set(ingredientKeys(ingredient));
  return items.some((item) => (keys.has(item.normalized) || keys.has(normalizeIngredient(item.name))) && itemMeetsDietaryRequirements(item, ingredient));
}

export function pantryHas(items: PantryItem[], ingredient: RecipeIngredient): boolean {
  if (ingredient.pantryStaple && assumedStaples.has(normalizeIngredient(ingredient.name))) return true;
  return actualPantryHas(items, ingredient);
}

function pantryKeys(items: PantryItem[]): Set<string> {
  return new Set(items.flatMap((item) => [item.normalized, normalizeIngredient(item.name)]));
}

function substitutionsFor(ingredient: RecipeIngredient): SubstituteOption[] {
  if (ingredient.dietaryRequirements?.length) return ingredient.substitutes ?? [];
  const canonical = normalizeIngredient(ingredient.name);
  const recipeSpecific = ingredient.substitutes ?? [];
  const library = substitutionLibrary[canonical] ?? [];
  const seen = new Set<string>();
  return [...recipeSpecific, ...library].filter((option) => {
    const key = option.label.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function optionIsAvailable(option: SubstituteOption, pantrySet: Set<string>): boolean {
  return option.requires.every((requirement) => {
    const normalized = normalizeIngredient(requirement);
    return normalized === 'water' || pantrySet.has(normalized) || assumedStaples.has(normalized);
  });
}

export function availableSubstitutes(items: PantryItem[], ingredient: RecipeIngredient): SubstituteOption[] {
  const set = pantryKeys(items);
  return substitutionsFor(ingredient).filter((option) => optionIsAvailable(option, set));
}

export function matchRecipes(
  pantry: PantryItem[],
  recipes: Recipe[],
  diets: DietaryPreference[] = [],
): RecipeMatch[] {
  const pantrySet = pantryKeys(pantry);
  const useSoonItems = pantry.filter((item) => item.useSoon);

  return recipes
    .map((recipe) => adaptRecipeForPreferences(recipe, diets))
    .filter((recipe): recipe is Recipe => Boolean(recipe))
    .map((recipe) => {
      const required = recipe.ingredients.filter((ingredient) => !ingredient.optional);
      const available = recipe.ingredients.filter((ingredient) => pantryHas(pantry, ingredient));
      const directMissing = required.filter((ingredient) => !pantryHas(pantry, ingredient));
      const availableSubstitutions: Record<string, SubstituteOption[]> = {};

      const missing = directMissing.filter((ingredient) => {
        const options = substitutionsFor(ingredient).filter((option) => optionIsAvailable(option, pantrySet));
        if (options.length) {
          availableSubstitutions[normalizeIngredient(ingredient.name)] = options;
          return false;
        }
        return true;
      });

      const optionalMissing = recipe.ingredients.filter((ingredient) => ingredient.optional && !pantryHas(pantry, ingredient));
      const satisfiedRequired = required.length - missing.length;
      const score = required.length ? satisfiedRequired / required.length : 1;
      const pantryScore = recipe.ingredients.length ? available.length / recipe.ingredients.length : 1;
      const usesSoon = recipe.ingredients.filter((ingredient) => actualPantryHas(useSoonItems, ingredient)).length;

      return {
        recipe,
        available,
        missing,
        optionalMissing,
        availableSubstitutions,
        score,
        pantryScore,
        usesSoon,
      };
    })
    .sort((a, b) => {
      if (a.missing.length !== b.missing.length) return a.missing.length - b.missing.length;
      if (b.usesSoon !== a.usesSoon) return b.usesSoon - a.usesSoon;
      if (b.score !== a.score) return b.score - a.score;
      return a.recipe.minutes - b.recipe.minutes;
    });
}

export function matchLabel(match: RecipeMatch): string {
  if (match.missing.length === 0) {
    const hasSub = Object.keys(match.availableSubstitutions).length > 0;
    return hasSub ? 'Ready with a swap' : 'You have everything';
  }
  return `Missing ${match.missing.length}`;
}

export function scaleAmount(amount: string, fromServings: number, toServings: number): string {
  if (fromServings === toServings) return amount;
  const ratio = toServings / fromServings;
  return amount.replace(/\b(\d+(?:\.\d+)?)\b/, (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return value;
    const scaled = number * ratio;
    return Number.isInteger(scaled) ? String(scaled) : String(Math.round(scaled * 10) / 10);
  });
}
