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
  return amount.replace(/\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?/g, (value) => {
    const number = parseQuantity(value);
    return number === null ? value : formatQuantity(number * ratio);
  });
}

function parseQuantity(value: string): number | null {
  const mixed = value.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const denominator = Number(mixed[3]);
    return denominator ? Number(mixed[1]) + Number(mixed[2]) / denominator : null;
  }
  const fraction = value.match(/^(\d+)\/(\d+)$/);
  if (fraction) {
    const denominator = Number(fraction[2]);
    return denominator ? Number(fraction[1]) / denominator : null;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function formatQuantity(value: number): string {
  const whole = Math.floor(value + 0.0001);
  const remainder = value - whole;
  const fractions: Array<[number, string]> = [
    [1 / 8, '1/8'], [1 / 6, '1/6'], [1 / 4, '1/4'], [1 / 3, '1/3'], [3 / 8, '3/8'],
    [1 / 2, '1/2'], [5 / 8, '5/8'], [2 / 3, '2/3'], [3 / 4, '3/4'], [5 / 6, '5/6'], [7 / 8, '7/8'],
  ];
  const nearest = fractions.reduce((best, candidate) => Math.abs(candidate[0] - remainder) < Math.abs(best[0] - remainder) ? candidate : best);

  if (remainder < 0.025) return String(whole);
  if (1 - remainder < 0.025) return String(whole + 1);
  if (Math.abs(nearest[0] - remainder) < 0.03) return whole ? `${whole} ${nearest[1]}` : nearest[1];
  return String(Math.round(value * 10) / 10);
}
