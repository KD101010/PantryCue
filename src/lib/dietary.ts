import type { DietaryPreference, Recipe, RecipeIngredient } from '../types';
import { normalizeIngredient } from './ingredients';

type Replacement = {
  name: string;
  aliases?: string[];
  requirements?: DietaryPreference[];
};

const GLUTEN_INGREDIENTS = new Set([
  'pasta', 'spaghetti', 'fettuccine', 'elbow macaroni', 'egg noodles', 'ramen noodles', 'lasagna noodles',
  'bread', 'white bread', 'wheat bread', 'sourdough bread', 'hamburger buns', 'hot dog buns', 'english muffins',
  'bagels', 'tortillas', 'flour tortillas', 'pita bread', 'naan', 'flour', 'whole wheat flour', 'breadcrumbs',
  'panko breadcrumbs', 'couscous', 'soy sauce', 'teriyaki sauce', 'worcestershire sauce', 'pie crust',
  'puff pastry', 'biscuits', 'crescent rolls', 'crackers', 'stuffing mix', 'cake mix', 'brownie mix',
  'oats', 'old fashioned oats', 'granola', 'cereal', 'cream of chicken soup', 'cream of mushroom soup',
  'marinara sauce', 'taco seasoning', 'enchilada sauce', 'barbecue sauce', 'buffalo sauce',
  'chicken broth', 'beef broth', 'vegetable broth', 'stock',
]);

const DAIRY_INGREDIENTS = new Set([
  'milk', 'whole milk', '2% milk', 'skim milk', 'buttermilk', 'heavy cream', 'half and half', 'evaporated milk',
  'condensed milk', 'butter', 'unsalted butter', 'sour cream', 'greek yogurt', 'plain yogurt', 'cream cheese',
  'cottage cheese', 'ricotta cheese', 'cheddar cheese', 'mozzarella cheese', 'parmesan cheese',
  'monterey jack cheese', 'pepper jack cheese', 'provolone cheese', 'swiss cheese', 'american cheese',
  'feta cheese', 'goat cheese', 'alfredo sauce', 'ranch dressing', 'caesar dressing', 'cream of chicken soup',
  'cream of mushroom soup',
]);

const MEAT_INGREDIENTS = new Set([
  'chicken breast', 'chicken thighs', 'rotisserie chicken', 'ground chicken', 'whole chicken', 'turkey breast',
  'ground turkey', 'deli turkey', 'ground beef', 'beef roast', 'beef stew meat', 'sirloin steak', 'ribeye steak',
  'flank steak', 'skirt steak', 'brisket', 'corned beef', 'pork chops', 'pork tenderloin', 'pork shoulder',
  'ground pork', 'bacon', 'ham', 'breakfast sausage', 'italian sausage', 'smoked sausage', 'chorizo', 'salmon',
  'tilapia', 'cod', 'tuna', 'canned tuna', 'shrimp', 'crab', 'scallops', 'white fish', 'fish sticks',
  'frozen meatballs', 'pepperoni',
]);

const PORK_INGREDIENTS = new Set([
  'pork chops', 'pork tenderloin', 'pork shoulder', 'ground pork', 'bacon', 'ham', 'breakfast sausage',
  'italian sausage', 'smoked sausage', 'chorizo', 'pepperoni',
]);

const NUT_INGREDIENTS = new Set(['peanut butter', 'almond butter', 'pesto']);
const ANIMAL_PRODUCTS = new Set([...MEAT_INGREDIENTS, ...DAIRY_INGREDIENTS, 'eggs', 'egg whites', 'honey', 'mayonnaise']);

function glutenReplacement(ingredient: RecipeIngredient): Replacement | null {
  const key = normalizeIngredient(ingredient.name);
  if (!GLUTEN_INGREDIENTS.has(key)) return null;

  if (key === 'soy sauce' || key === 'teriyaki sauce' || key === 'worcestershire sauce') {
    return { name: key === 'soy sauce' ? 'Gluten-free tamari' : `Gluten-free ${ingredient.name.toLowerCase()}`, aliases: [ingredient.name, ...(ingredient.aliases ?? []), key], requirements: ['gluten-free'] };
  }
  if (key === 'flour' || key === 'whole wheat flour') {
    return { name: 'Gluten-free 1-to-1 flour', aliases: [ingredient.name, 'flour'], requirements: ['gluten-free'] };
  }
  if (key === 'oats' || key === 'old fashioned oats' || key === 'granola' || key === 'cereal') {
    return { name: `Certified gluten-free ${ingredient.name.toLowerCase()}`, aliases: [ingredient.name, ...(ingredient.aliases ?? [])], requirements: ['gluten-free'] };
  }
  return {
    name: `Gluten-free ${ingredient.name.toLowerCase()}`,
    aliases: [ingredient.name, ...(ingredient.aliases ?? []), ...(key === 'tortillas' ? ['corn tortillas'] : []), ...(key.includes('noodles') || key === 'pasta' || key === 'spaghetti' ? ['rice noodles'] : [])],
    requirements: ['gluten-free'],
  };
}

function dairyReplacement(ingredient: RecipeIngredient): Replacement | null {
  const key = normalizeIngredient(ingredient.name);
  if (!DAIRY_INGREDIENTS.has(key)) return null;

  if (key.includes('milk') || key === 'buttermilk') {
    return { name: key === 'buttermilk' ? 'Dairy-free buttermilk' : 'Unsweetened dairy-free milk', aliases: [ingredient.name, 'oat milk', 'soy milk', 'rice milk', 'coconut milk'], requirements: ['dairy-free'] };
  }
  if (key === 'heavy cream' || key === 'half and half') {
    return { name: 'Dairy-free cooking cream', aliases: [ingredient.name, 'coconut milk'], requirements: ['dairy-free'] };
  }
  return { name: `Dairy-free ${ingredient.name.toLowerCase()}`, aliases: [ingredient.name, ...(ingredient.aliases ?? [])], requirements: ['dairy-free'] };
}

function replacementFor(diet: DietaryPreference, ingredient: RecipeIngredient): Replacement | null {
  const key = normalizeIngredient(ingredient.name);
  if (diet === 'gluten-free') return glutenReplacement(ingredient);
  if (diet === 'dairy-free') return dairyReplacement(ingredient);
  if (diet === 'vegetarian') {
    if (key === 'chicken broth' || key === 'beef broth' || key === 'stock') return { name: 'Vegetable broth', aliases: ['vegetable broth'] };
    if (key === 'worcestershire sauce') return { name: 'Vegetarian Worcestershire sauce', requirements: ['vegetarian'] };
    return null;
  }
  if (diet === 'vegan') {
    if (key === 'chicken broth' || key === 'beef broth' || key === 'stock') return { name: 'Vegetable broth', aliases: ['vegetable broth'] };
    if (key === 'honey') return { name: 'Maple syrup', aliases: ['maple syrup'] };
    if (key === 'mayonnaise') return { name: 'Vegan mayonnaise', aliases: ['vegan mayo'], requirements: ['vegan'] };
    const dairy = dairyReplacement(ingredient);
    return dairy ? { ...dairy, requirements: Array.from(new Set([...(dairy.requirements ?? []), 'vegan'])) } : null;
  }
  if (diet === 'nut-free') {
    if (key === 'peanut butter' || key === 'almond butter') return { name: 'Sunflower seed butter', aliases: ['sun butter', 'sunflower butter'], requirements: ['nut-free'] };
    if (key === 'pesto') return { name: 'Nut-free pesto', aliases: ['pesto'], requirements: ['nut-free'] };
  }
  return null;
}

function isIncompatible(diet: DietaryPreference, ingredient: RecipeIngredient): boolean {
  const key = normalizeIngredient(ingredient.name);
  if (diet === 'gluten-free') return GLUTEN_INGREDIENTS.has(key);
  if (diet === 'dairy-free') return DAIRY_INGREDIENTS.has(key);
  if (diet === 'vegetarian') return MEAT_INGREDIENTS.has(key) || key === 'chicken broth' || key === 'beef broth' || key === 'worcestershire sauce';
  if (diet === 'vegan') return ANIMAL_PRODUCTS.has(key) || key === 'chicken broth' || key === 'beef broth' || key === 'worcestershire sauce';
  if (diet === 'pork-free') return PORK_INGREDIENTS.has(key);
  if (diet === 'nut-free') return NUT_INGREDIENTS.has(key);
  return false;
}

function adaptIngredient(ingredient: RecipeIngredient, diet: DietaryPreference): RecipeIngredient | null | false {
  if (!isIncompatible(diet, ingredient)) return ingredient;
  const replacement = replacementFor(diet, ingredient);
  if (!replacement) return ingredient.optional ? null : false;
  const requirements = Array.from(new Set([...(ingredient.dietaryRequirements ?? []), ...(replacement.requirements ?? [])]));
  let name = replacement.name;
  if (requirements.includes('gluten-free') && !/\b(gluten[ -]?free|gf)\b/i.test(name)) name = `Gluten-free ${name.toLowerCase()}`;
  if (requirements.includes('dairy-free') && !/\b(dairy[ -]?free|non[ -]?dairy)\b/i.test(name)) name = `Dairy-free ${name.toLowerCase()}`;
  if (requirements.includes('vegan') && !/\bvegan\b/i.test(name)) name = `Vegan ${name.toLowerCase()}`;
  if (requirements.includes('vegetarian') && !/\bvegetarian\b/i.test(name)) name = `Vegetarian ${name.toLowerCase()}`;
  if (requirements.includes('nut-free') && !/\bnut[ -]?free\b/i.test(name)) name = `Nut-free ${name.toLowerCase()}`;
  return {
    ...ingredient,
    name,
    aliases: replacement.aliases,
    pantryStaple: false,
    dietaryRequirements: requirements,
  };
}

const dietNotes: Partial<Record<DietaryPreference, string>> = {
  'gluten-free': 'Use products specifically labeled gluten-free and check packaged sauces, broths, seasonings, and shared-kitchen labels.',
  'dairy-free': 'Use the dairy-free products listed and check packaged foods for milk-derived ingredients.',
  vegan: 'Use products labeled vegan and check packaged sauces and broths for animal-derived ingredients.',
  'nut-free': 'Check packaged-food labels and shared-equipment warnings when avoiding nuts for an allergy.',
};

export function adaptRecipeForPreferences(recipe: Recipe, diets: DietaryPreference[]): Recipe | null {
  if (!diets.length) return recipe;

  let ingredients = recipe.ingredients.map((ingredient) => ({ ...ingredient }));
  const adaptedFor = new Set<DietaryPreference>();
  const notes = new Set<string>();

  for (const diet of diets) {
    let changed = false;
    const next: RecipeIngredient[] = [];
    for (const ingredient of ingredients) {
      const adapted = adaptIngredient(ingredient, diet);
      if (adapted === false) return null;
      if (adapted === null) {
        changed = true;
        continue;
      }
      if (adapted !== ingredient || adapted.name !== ingredient.name) changed = true;
      next.push(adapted);
    }
    ingredients = next;
    if (changed || !recipe.diets.includes(diet)) adaptedFor.add(diet);
    if (dietNotes[diet] && (changed || diet === 'gluten-free' || diet === 'nut-free')) notes.add(dietNotes[diet]!);
  }

  return {
    ...recipe,
    ingredients,
    diets: Array.from(new Set([...recipe.diets, ...diets])),
    adaptedFor: Array.from(adaptedFor),
    dietaryNotes: Array.from(notes),
  };
}

export function dietLabel(diet: DietaryPreference): string {
  const labels: Record<DietaryPreference, string> = {
    vegetarian: 'Vegetarian',
    vegan: 'Vegan',
    'gluten-free': 'Gluten-free',
    'dairy-free': 'Dairy-free',
    'pork-free': 'Pork-free',
    'nut-free': 'Nut-free',
  };
  return labels[diet];
}
