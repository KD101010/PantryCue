import { describe, expect, it } from 'vitest';
import { recipeCount, recipes } from '../data/recipes';
import type { PantryItem, StorageZone } from '../types';
import { buildCookingGuide, inferEquipment } from './cooking';
import { adaptRecipeForPreferences } from './dietary';
import { ingredientVariantKey, normalizeIngredient } from './ingredients';
import { matchRecipes } from './matching';
import { barcodeIngredientName } from '../services/openFoodFacts';

function pantry(...names: string[]): PantryItem[] {
  return names.map((name, index) => ({
    id: String(index),
    name,
    normalized: normalizeIngredient(name),
    zone: 'pantry' as StorageZone,
    addedAt: '2026-08-16T00:00:00.000Z',
  }));
}

describe('dietary recipe matching', () => {
  it('finds gluten-free spaghetti when the labeled ingredients are in the kitchen', () => {
    const matches = matchRecipes(
      pantry('Gluten-free spaghetti', 'Gluten-free sauce', 'Ground beef', 'Garlic', 'Italian seasoning'),
      recipes,
      ['gluten-free'],
    );
    const spaghetti = matches.find((match) => match.recipe.id === 'spaghetti-meat-sauce');

    expect(spaghetti).toBeDefined();
    expect(spaghetti?.missing).toHaveLength(0);
    expect(spaghetti?.recipe.ingredients.some((ingredient) => ingredient.name === 'Gluten-free spaghetti')).toBe(true);
    expect(spaghetti?.recipe.ingredients.some((ingredient) => ingredient.name === 'Gluten-free marinara sauce')).toBe(true);
    expect(spaghetti?.recipe.adaptedFor).toContain('gluten-free');
  });

  it('does not treat ordinary pasta as gluten-free pasta', () => {
    const matches = matchRecipes(
      pantry('Spaghetti', 'Marinara sauce', 'Ground beef', 'Garlic', 'Italian seasoning'),
      recipes,
      ['gluten-free'],
    );
    const spaghetti = matches.find((match) => match.recipe.id === 'spaghetti-meat-sauce');

    expect(spaghetti?.missing.map((ingredient) => ingredient.name)).toContain('Gluten-free spaghetti');
  });

  it('requires labeled dairy-free products for an adapted creamy recipe', () => {
    const safe = matchRecipes(
      pantry('Chicken breast', 'Pasta', 'Dairy-free cooking cream', 'Dairy-free parmesan cheese', 'Garlic'),
      recipes,
      ['dairy-free'],
    ).find((match) => match.recipe.id === 'creamy-garlic-chicken-pasta');
    const unsafe = matchRecipes(
      pantry('Chicken breast', 'Pasta', 'Heavy cream', 'Parmesan cheese', 'Garlic'),
      recipes,
      ['dairy-free'],
    ).find((match) => match.recipe.id === 'creamy-garlic-chicken-pasta');

    expect(safe?.missing).toHaveLength(0);
    expect(unsafe?.missing.map((ingredient) => ingredient.name)).toEqual(expect.arrayContaining([
      'Dairy-free cooking cream',
      'Dairy-free parmesan cheese',
    ]));
  });

  it('removes recipes with a required pork ingredient for a pork-free profile', () => {
    const matches = matchRecipes(pantry('Pork shoulder', 'Barbecue sauce', 'Hamburger buns'), recipes, ['pork-free']);
    expect(matches.some((match) => match.recipe.id === 'pulled-pork-sandwiches')).toBe(false);
  });

  it('keeps dietary variants distinct in the kitchen', () => {
    expect(ingredientVariantKey('Spaghetti')).not.toBe(ingredientVariantKey('Gluten-free spaghetti'));
    expect(ingredientVariantKey('GF noodles')).toBe(ingredientVariantKey('Gluten-free pasta'));
  });

  it('preserves dietary labels when a barcode product is normalized', () => {
    expect(barcodeIngredientName('Barilla Gluten Free Spaghetti')).toBe('Gluten-Free Pasta');
    expect(barcodeIngredientName('Dairy Free Cheddar Cheese')).toBe('Dairy-Free Cheddar Cheese');
  });
});

describe('recipe catalog and cooking guidance', () => {
  it('contains 110 unique base recipes', () => {
    expect(recipeCount).toBe(110);
    expect(new Set(recipes.map((recipe) => recipe.id)).size).toBe(recipeCount);
  });

  it('provides broad dietary coverage instead of a tiny filtered list', () => {
    expect(matchRecipes([], recipes, ['gluten-free']).length).toBe(110);
    expect(matchRecipes([], recipes, ['dairy-free']).length).toBe(110);
    expect(matchRecipes([], recipes, ['gluten-free', 'dairy-free']).length).toBe(110);
    expect(matchRecipes([], recipes, ['vegetarian']).length).toBeGreaterThanOrEqual(25);
    expect(matchRecipes([], recipes, ['vegan']).length).toBeGreaterThanOrEqual(15);
  });

  it('has complete fields and honors every diet declared by a recipe', () => {
    const invalidDeclarations: string[] = [];
    for (const recipe of recipes) {
      expect(recipe.title.trim()).not.toBe('');
      expect(recipe.ingredients.length).toBeGreaterThanOrEqual(3);
      expect(recipe.steps.length).toBeGreaterThanOrEqual(3);
      for (const diet of recipe.diets) {
        if (!adaptRecipeForPreferences(recipe, [diet])) invalidDeclarations.push(`${recipe.id}:${diet}`);
      }
    }
    expect(invalidDeclarations).toEqual([]);
  });

  it('turns the spaghetti recipe into a detailed guided flow', () => {
    const recipe = recipes.find((candidate) => candidate.id === 'spaghetti-meat-sauce');
    expect(recipe).toBeDefined();

    const guide = buildCookingGuide(recipe!);
    const instructions = guide.map((step) => step.instruction).join(' ');

    expect(guide.length).toBeGreaterThanOrEqual(10);
    expect(instructions).toMatch(/rolling boil/i);
    expect(instructions).toContain('160°F');
    expect(instructions).toMatch(/center|medium-high/i);
    expect(inferEquipment(recipe!)).toEqual(expect.arrayContaining(['Large pot', 'Colander', 'Large skillet', 'Instant-read thermometer']));
  });

  it('adds setup and serving guidance to every recipe without blank steps', () => {
    for (const recipe of recipes) {
      const guide = buildCookingGuide(recipe);
      expect(guide.length).toBeGreaterThanOrEqual(recipe.steps.length + 2);
      expect(guide.every((step) => step.title.trim() && step.instruction.trim())).toBe(true);
    }
  });
});
