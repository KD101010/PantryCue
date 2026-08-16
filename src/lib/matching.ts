import { pantryStaples } from '../data/ingredientCatalog';
import { substitutionLibrary } from '../data/substitutions';
import type { DietaryPreference, PantryItem, Recipe, RecipeIngredient, RecipeMatch, SubstituteOption } from '../types';
import { normalizeIngredient } from './ingredients';

const assumedStaples = new Set(pantryStaples.map(normalizeIngredient));

function pantrySetFor(items: PantryItem[]): Set<string> {
  return new Set(items.map((item) => item.normalized));
}

export function ingredientKeys(ingredient: RecipeIngredient): string[] {
  return [ingredient.name, ...(ingredient.aliases ?? [])].map(normalizeIngredient);
}

export function pantryHas(pantrySet: Set<string>, ingredient: RecipeIngredient): boolean {
  if (ingredient.pantryStaple && assumedStaples.has(normalizeIngredient(ingredient.name))) return true;
  return ingredientKeys(ingredient).some((key) => pantrySet.has(key));
}

function substitutionsFor(ingredient: RecipeIngredient): SubstituteOption[] {
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
  const set = pantrySetFor(items);
  return substitutionsFor(ingredient).filter((option) => optionIsAvailable(option, set));
}

export function matchRecipes(
  pantry: PantryItem[],
  recipes: Recipe[],
  diets: DietaryPreference[] = [],
): RecipeMatch[] {
  const pantrySet = pantrySetFor(pantry);
  const useSoonSet = new Set(pantry.filter((item) => item.useSoon).map((item) => item.normalized));

  return recipes
    .filter((recipe) => diets.every((diet) => recipe.diets.includes(diet)))
    .map((recipe) => {
      const required = recipe.ingredients.filter((ingredient) => !ingredient.optional);
      const available = recipe.ingredients.filter((ingredient) => pantryHas(pantrySet, ingredient));
      const directMissing = required.filter((ingredient) => !pantryHas(pantrySet, ingredient));
      const availableSubstitutions: Record<string, SubstituteOption[]> = {};

      const missing = directMissing.filter((ingredient) => {
        const options = substitutionsFor(ingredient).filter((option) => optionIsAvailable(option, pantrySet));
        if (options.length) {
          availableSubstitutions[normalizeIngredient(ingredient.name)] = options;
          return false;
        }
        return true;
      });

      const optionalMissing = recipe.ingredients.filter((ingredient) => ingredient.optional && !pantryHas(pantrySet, ingredient));
      const satisfiedRequired = required.length - missing.length;
      const score = required.length ? satisfiedRequired / required.length : 1;
      const pantryScore = recipe.ingredients.length ? available.length / recipe.ingredients.length : 1;
      const usesSoon = recipe.ingredients.filter((ingredient) => ingredientKeys(ingredient).some((key) => useSoonSet.has(key))).length;

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
