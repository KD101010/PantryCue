import type { SubstituteOption } from '../types';

export const substitutionLibrary: Record<string, SubstituteOption[]> = {
  'heavy cream': [
    { label: 'Milk + butter', requires: ['milk', 'butter'], note: 'For 1 cup heavy cream, use about 3/4 cup milk plus 1/4 cup melted butter.' },
    { label: 'Half and half', requires: ['half and half'], note: 'Use the same amount. The sauce may be slightly lighter.' },
  ],
  milk: [
    { label: 'Evaporated milk', requires: ['evaporated milk'], note: 'Dilute slightly with water for a lighter result.' },
    { label: 'Half and half + water', requires: ['half and half', 'water'], note: 'Use equal parts half and half and water.' },
    { label: 'Heavy cream + water', requires: ['heavy cream', 'water'], note: 'Use about half cream and half water.' },
  ],
  buttermilk: [
    { label: 'Milk + lemon', requires: ['milk', 'lemons'], note: 'Add 1 tablespoon lemon juice per cup of milk and let it sit for 5 minutes.' },
  ],
  'sour cream': [
    { label: 'Plain Greek yogurt', requires: ['greek yogurt'], note: 'Use the same amount.' },
    { label: 'Cream cheese + milk', requires: ['cream cheese', 'milk'], note: 'Thin cream cheese with a little milk until spoonable.' },
  ],
  butter: [
    { label: 'Olive oil', requires: ['olive oil'], note: 'Good for sauteing and many savory recipes.' },
    { label: 'Vegetable oil', requires: ['vegetable oil'], note: 'Good for sauteing or greasing a pan.' },
  ],
  'olive oil': [
    { label: 'Vegetable oil', requires: ['vegetable oil'], note: 'Use the same amount for cooking.' },
    { label: 'Butter', requires: ['butter'], note: 'Use for skillet cooking when the flavor works with the dish.' },
  ],
  'cheddar cheese': [
    { label: 'Monterey Jack', requires: ['monterey jack cheese'], note: 'A mild, melty swap.' },
    { label: 'Mozzarella', requires: ['mozzarella cheese'], note: 'Milder flavor, but melts well.' },
    { label: 'Pepper Jack', requires: ['pepper jack cheese'], note: 'Adds a little heat.' },
  ],
  'mozzarella cheese': [
    { label: 'Monterey Jack', requires: ['monterey jack cheese'], note: 'Melts similarly and stays mild.' },
    { label: 'Cheddar', requires: ['cheddar cheese'], note: 'Stronger flavor but works in casseroles and baked dishes.' },
  ],
  'parmesan cheese': [
    { label: 'Romano-style hard cheese', requires: ['parmesan cheese'], note: 'Any finely grated hard Italian-style cheese works.' },
  ],
  'chicken broth': [
    { label: 'Vegetable broth', requires: ['vegetable broth'], note: 'Use the same amount.' },
    { label: 'Water + extra seasoning', requires: ['water'], note: 'Use water and season the dish a little more generously.' },
  ],
  'beef broth': [
    { label: 'Chicken broth', requires: ['chicken broth'], note: 'Use the same amount. The flavor will be lighter.' },
    { label: 'Water + Worcestershire', requires: ['water', 'worcestershire sauce'], note: 'Add a small splash of Worcestershire to seasoned water.' },
  ],
  'vegetable broth': [
    { label: 'Chicken broth', requires: ['chicken broth'], note: 'Use only if the meal does not need to stay vegetarian.' },
    { label: 'Water + extra seasoning', requires: ['water'], note: 'Use water and adjust salt and herbs to taste.' },
  ],
  'tomato sauce': [
    { label: 'Marinara sauce', requires: ['marinara sauce'], note: 'Use the same amount and reduce extra seasoning if needed.' },
    { label: 'Diced tomatoes', requires: ['diced tomatoes'], note: 'Blend or crush for a smoother sauce.' },
  ],
  'marinara sauce': [
    { label: 'Tomato sauce + Italian seasoning', requires: ['tomato sauce', 'italian seasoning'], note: 'Season tomato sauce to taste and simmer briefly.' },
    { label: 'Crushed tomatoes + seasoning', requires: ['crushed tomatoes', 'italian seasoning'], note: 'Simmer for 10 minutes if time allows.' },
  ],
  'diced tomatoes': [
    { label: 'Crushed tomatoes', requires: ['crushed tomatoes'], note: 'Use the same amount for a smoother result.' },
    { label: 'Fresh tomatoes', requires: ['tomatoes'], note: 'Dice fresh tomatoes and cook them a few minutes longer.' },
  ],
  'taco seasoning': [
    { label: 'Chili powder + cumin + garlic powder', requires: ['chili powder', 'cumin', 'garlic powder'], note: 'Start with 1 teaspoon chili powder, 1/2 teaspoon cumin, and 1/2 teaspoon garlic powder per tablespoon of taco seasoning.' },
  ],
  'italian seasoning': [
    { label: 'Oregano + basil', requires: ['oregano', 'basil'], note: 'Use roughly equal parts.' },
  ],
  breadcrumbs: [
    { label: 'Crushed crackers', requires: ['crackers'], note: 'Crush finely and use about the same volume.' },
    { label: 'Panko', requires: ['panko breadcrumbs'], note: 'Use the same amount.' },
    { label: 'Oats', requires: ['oats'], note: 'Pulse or crush oats for meatloaf and meatballs.' },
  ],
  'panko breadcrumbs': [
    { label: 'Breadcrumbs', requires: ['breadcrumbs'], note: 'Use the same amount.' },
    { label: 'Crushed crackers', requires: ['crackers'], note: 'Use a similar volume.' },
  ],
  lemons: [
    { label: 'Lime', requires: ['limes'], note: 'Use the same amount when the flavor works with the dish.' },
  ],
  limes: [
    { label: 'Lemon', requires: ['lemons'], note: 'Use the same amount when the flavor works with the dish.' },
  ],
  'soy sauce': [
    { label: 'Teriyaki sauce', requires: ['teriyaki sauce'], note: 'Use a little less because teriyaki is sweeter.' },
  ],
  'cream of chicken soup': [
    { label: 'Cream of mushroom soup', requires: ['cream of mushroom soup'], note: 'Works well in most casseroles.' },
  ],
  'cream of mushroom soup': [
    { label: 'Cream of chicken soup', requires: ['cream of chicken soup'], note: 'Works well unless the dish needs to stay vegetarian.' },
  ],
};
