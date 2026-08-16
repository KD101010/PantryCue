import type { DietaryPreference, Recipe, RecipeIngredient } from '../types';

type RecipeInput = Omit<Recipe, 'difficulty'> & { difficulty?: Recipe['difficulty'] };

const i = (name: string, amount: string, options: Partial<Omit<RecipeIngredient, 'name' | 'amount'>> = {}): RecipeIngredient => ({ name, amount, ...options });
const make = (input: RecipeInput): Recipe => ({ difficulty: 'Easy', ...input });
const oil = i('Olive oil', '1 tbsp', { pantryStaple: true });
const saltPepper = [i('Salt', 'to taste', { pantryStaple: true }), i('Black pepper', 'to taste', { pantryStaple: true })];
const gfDf: DietaryPreference[] = ['gluten-free', 'dairy-free', 'pork-free', 'nut-free'];
const veganGfDf: DietaryPreference[] = ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'pork-free', 'nut-free'];
const veganAdaptable: DietaryPreference[] = ['vegan', 'vegetarian', 'dairy-free', 'pork-free', 'nut-free'];

export const expandedRecipes: Recipe[] = [
  make({
    id: 'chicken-fajita-rice-bowls', title: 'Chicken Fajita Rice Bowls', summary: 'Colorful chicken and peppers over rice with lime.', minutes: 30, servings: 4, cuisine: 'Tex-Mex', tags: ['Bowl', 'Weeknight', 'High protein'], diets: gfDf,
    ingredients: [i('Chicken breast', '1 lb'), i('Cooked rice', '4 cups', { aliases: ['rice'] }), i('Bell peppers', '2'), i('Onion', '1'), i('Taco seasoning', '2 tbsp'), i('Limes', '1'), i('Salsa', '1/2 cup', { optional: true }), oil, ...saltPepper],
    steps: ['Slice the chicken, peppers, and onion into thin, even strips. Pat the chicken dry and season it with taco seasoning.', 'Heat half the oil in a large skillet over medium-high heat. Sear the chicken in one layer until browned, then transfer it to a clean plate.', 'Add the remaining oil, peppers, and onion. Cook for 5 to 7 minutes, stirring occasionally, until tender with browned edges.', 'Return the chicken and any juices to the skillet. Cook until the thickest piece reaches 165°F.', 'Warm the rice, divide it among bowls, add the fajita mixture, and finish with lime and optional salsa.'],
  }),
  make({
    id: 'coconut-chicken-curry', title: 'Coconut Chicken Curry', summary: 'A mild, creamy curry with chicken, vegetables, and coconut milk.', minutes: 35, servings: 4, cuisine: 'Indian-inspired', tags: ['One pot', 'Comforting'], diets: gfDf,
    ingredients: [i('Chicken breast', '1 lb'), i('Coconut milk', '1 can'), i('Diced tomatoes', '1 can'), i('Onion', '1'), i('Frozen mixed vegetables', '2 cups'), i('Curry powder', '2 tbsp'), i('Garlic', '2 cloves'), i('Cooked rice', '4 cups', { aliases: ['rice'], optional: true }), oil, ...saltPepper],
    steps: ['Cut the chicken into 1-inch pieces, dice the onion, and mince the garlic.', 'Heat oil in a deep skillet over medium-high. Brown the chicken for 3 to 4 minutes; it will finish cooking in the sauce.', 'Reduce to medium, add onion, and cook until softened. Stir in garlic and curry powder for 30 seconds.', 'Add tomatoes, coconut milk, and vegetables. Scrape the bottom of the pan and bring to a gentle simmer.', 'Simmer uncovered for 12 to 15 minutes, stirring occasionally, until the chicken reaches 165°F and the sauce lightly thickens.', 'Taste, season with salt and pepper, and serve alone or over warm rice.'],
  }),
  make({
    id: 'lemon-herb-chicken-quinoa', title: 'Lemon Herb Chicken and Quinoa', summary: 'Bright skillet chicken with fluffy quinoa and herbs.', minutes: 35, servings: 4, cuisine: 'Mediterranean-inspired', tags: ['Balanced', 'One pan'], diets: gfDf,
    ingredients: [i('Chicken breast', '1 lb'), i('Quinoa', '1 cup'), i('Chicken broth', '2 cups'), i('Lemons', '1'), i('Garlic', '2 cloves'), i('Spinach', '3 cups', { optional: true }), i('Italian seasoning', '1 tsp'), oil, ...saltPepper],
    steps: ['Rinse quinoa in a fine-mesh strainer. Cut the chicken into four even cutlets and season with salt, pepper, and Italian seasoning.', 'Heat oil in a deep skillet over medium-high. Brown chicken for 3 to 4 minutes per side, then move it to a plate.', 'Lower heat to medium, add garlic, and stir for 30 seconds. Add quinoa and broth and bring to a simmer.', 'Nestle chicken into the quinoa, cover, and cook over low heat for 15 minutes without lifting the lid.', 'Check that the chicken reaches 165°F and the quinoa is tender. Fold in optional spinach until wilted.', 'Rest covered for 5 minutes, fluff the quinoa, and squeeze lemon over the pan before serving.'],
  }),
  make({
    id: 'chicken-spinach-tomato-skillet', title: 'Chicken Spinach Tomato Skillet', summary: 'Juicy chicken in a garlicky tomato and spinach pan sauce.', minutes: 28, servings: 4, cuisine: 'Italian-inspired', tags: ['Skillet', 'Weeknight'], diets: gfDf,
    ingredients: [i('Chicken breast', '1 1/2 lb'), i('Diced tomatoes', '1 can'), i('Spinach', '4 cups'), i('Garlic', '3 cloves'), i('Italian seasoning', '1 tsp'), oil, ...saltPepper],
    steps: ['Pat the chicken dry. If pieces are thick, slice them horizontally into even cutlets, then season both sides.', 'Heat oil in a large skillet over medium-high and sear chicken until golden, about 4 minutes per side. Transfer to a plate.', 'Lower heat to medium, add garlic for 30 seconds, then add tomatoes and Italian seasoning.', 'Simmer for 5 minutes, scraping up the browned bits. Return the chicken and simmer until it reaches 165°F.', 'Add spinach by handfuls and stir until just wilted. Taste the sauce and serve.'],
  }),
  make({
    id: 'honey-garlic-chicken-rice', title: 'Honey Garlic Chicken Rice Bowls', summary: 'Sweet-savory glazed chicken with rice and quick vegetables.', minutes: 30, servings: 4, cuisine: 'Asian-inspired', tags: ['Bowl', 'Family friendly'], diets: gfDf,
    ingredients: [i('Chicken breast', '1 lb'), i('Cooked rice', '4 cups', { aliases: ['rice'] }), i('Frozen broccoli', '3 cups', { aliases: ['broccoli'] }), i('Honey', '3 tbsp'), i('Soy sauce', '3 tbsp'), i('Garlic', '3 cloves'), i('Cornstarch', '1 tsp'), i('Vegetable oil', '1 tbsp', { pantryStaple: true })],
    steps: ['Cut chicken into 1-inch pieces and pat dry. Whisk honey, soy sauce, garlic, cornstarch, and 1/3 cup water in a small bowl.', 'Heat oil in a large skillet over medium-high. Add chicken in one layer and cook until browned on two sides.', 'Add broccoli and 2 tablespoons water, cover, and steam for 3 minutes.', 'Stir the sauce again, pour it into the skillet, and simmer until glossy and the chicken reaches 165°F.', 'Warm the rice, divide into bowls, and spoon the chicken, vegetables, and sauce over it.'],
  }),
  make({
    id: 'turkey-sweet-potato-skillet', title: 'Turkey Sweet Potato Skillet', summary: 'Ground turkey, sweet potatoes, and vegetables in one satisfying pan.', minutes: 35, servings: 4, cuisine: 'American', tags: ['One pan', 'Balanced'], diets: gfDf,
    ingredients: [i('Ground turkey', '1 lb'), i('Sweet potatoes', '1 lb'), i('Bell peppers', '1'), i('Onion', '1/2'), i('Spinach', '3 cups', { optional: true }), i('Paprika', '1 tsp', { pantryStaple: true }), i('Garlic powder', '1 tsp', { pantryStaple: true }), oil, ...saltPepper],
    steps: ['Peel and cut sweet potatoes into 1/2-inch cubes. Dice the pepper and onion.', 'Heat oil in a large skillet over medium-high. Brown turkey, breaking it into small pieces, until it reaches 165°F; move it to a plate.', 'Add sweet potatoes, onion, pepper, and 1/3 cup water. Cover and cook over medium for 10 to 12 minutes, stirring twice.', 'Remove the lid and cook until excess water evaporates and the potatoes brown at the edges.', 'Return turkey, add seasonings and optional spinach, and stir until hot and the spinach wilts.'],
  }),
  make({
    id: 'turkey-meatballs-marinara', title: 'Turkey Meatballs in Marinara', summary: 'Tender baked turkey meatballs finished in tomato sauce.', minutes: 40, servings: 4, cuisine: 'Italian-American', tags: ['Oven', 'Meal prep'], diets: ['dairy-free', 'pork-free', 'nut-free'], difficulty: 'Moderate',
    ingredients: [i('Ground turkey', '1 lb'), i('Eggs', '1'), i('Breadcrumbs', '1/2 cup'), i('Marinara sauce', '24 oz'), i('Onion', '1/4'), i('Garlic powder', '1 tsp', { pantryStaple: true }), i('Italian seasoning', '1 tsp'), ...saltPepper],
    steps: ['Position a rack in the center and heat the oven to 400°F. Line a rimmed sheet pan.', 'Finely grate or mince the onion. Mix turkey, egg, breadcrumbs, onion, garlic powder, Italian seasoning, salt, and pepper just until combined.', 'With damp hands, shape 16 equal meatballs and space them on the pan.', 'Bake on the center rack for 14 to 18 minutes, until browned and 165°F in the center.', 'Warm marinara in a deep skillet over medium-low. Add the meatballs and simmer gently for 5 minutes before serving.'],
  }),
  make({
    id: 'beef-taco-rice-bowls', title: 'Beef Taco Rice Bowls', summary: 'Seasoned beef, rice, beans, and salsa in build-your-own bowls.', minutes: 25, servings: 4, cuisine: 'Tex-Mex', tags: ['Bowl', 'Family friendly'], diets: gfDf,
    ingredients: [i('Ground beef', '1 lb'), i('Cooked rice', '4 cups', { aliases: ['rice'] }), i('Black beans', '1 can'), i('Salsa', '1 cup'), i('Taco seasoning', '2 tbsp'), i('Lettuce', '2 cups', { optional: true }), i('Avocado', '1', { optional: true })],
    steps: ['Drain and rinse the beans. Warm the rice and prepare any optional lettuce or avocado.', 'Heat a large skillet over medium-high. Add beef and cook while breaking it into small pieces.', 'When the beef is browned and reaches 160°F, carefully drain excess grease.', 'Add taco seasoning and 1/3 cup water. Simmer over medium-low until the liquid coats the meat.', 'Divide rice among bowls and add beef, beans, salsa, and optional toppings.'],
  }),
  make({
    id: 'burger-salad-bowls', title: 'Burger Salad Bowls', summary: 'All the familiar burger flavors over a crisp, easy salad.', minutes: 22, servings: 4, cuisine: 'American', tags: ['Low prep', 'Bowl'], diets: gfDf,
    ingredients: [i('Ground beef', '1 lb'), i('Lettuce', '6 cups'), i('Tomatoes', '2'), i('Pickles', '1/2 cup'), i('Onion', '1/4', { optional: true }), i('Ketchup', '3 tbsp'), i('Mustard', '2 tbsp'), ...saltPepper],
    steps: ['Wash and dry the lettuce, chop the tomatoes and pickles, and thinly slice optional onion.', 'Whisk ketchup, mustard, 2 tablespoons water, and a pinch of pepper into a pourable dressing.', 'Heat a skillet over medium-high. Brown beef in small crumbles until no pink remains and it reaches 160°F; drain if needed.', 'Season the beef with salt and pepper and let it cool for 2 minutes so it does not wilt the lettuce.', 'Build bowls with lettuce, vegetables, warm beef, and dressing.'],
  }),
  make({
    id: 'beef-pepper-rice-skillet', title: 'Beef Pepper Rice Skillet', summary: 'A savory one-pan beef and rice dinner with sweet peppers.', minutes: 38, servings: 4, cuisine: 'American', tags: ['One pan', 'Family friendly'], diets: gfDf,
    ingredients: [i('Ground beef', '1 lb'), i('Rice', '1 cup'), i('Bell peppers', '2'), i('Onion', '1/2'), i('Diced tomatoes', '1 can'), i('Beef broth', '2 cups'), i('Garlic', '2 cloves'), oil, ...saltPepper],
    steps: ['Dice the peppers and onion and mince the garlic. Rinse the rice if its package directs.', 'Brown beef in a deep skillet over medium-high until it reaches 160°F. Drain excess grease and move beef to a plate.', 'Cook peppers and onion over medium for 4 minutes. Add garlic and rice and stir for 30 seconds.', 'Add tomatoes and broth, scraping the skillet. Bring to a simmer, cover, and cook over low heat according to the rice package.', 'Rest covered for 5 minutes. Return the beef, fluff gently, and heat through before serving.'],
  }),
  make({
    id: 'salmon-vegetable-sheet-pan', title: 'Sheet Pan Salmon and Vegetables', summary: 'Roasted salmon and colorful vegetables with almost no cleanup.', minutes: 30, servings: 4, cuisine: 'American', tags: ['Sheet pan', 'Easy cleanup'], diets: gfDf,
    ingredients: [i('Salmon', '1 1/2 lb'), i('Broccoli', '3 cups'), i('Bell peppers', '2'), i('Lemons', '1'), i('Garlic powder', '1 tsp', { pantryStaple: true }), i('Olive oil', '2 tbsp', { pantryStaple: true }), ...saltPepper],
    steps: ['Position a rack in the center and heat the oven to 425°F. Line a rimmed sheet pan.', 'Cut vegetables into similar bite-size pieces. Toss them with half the oil, garlic powder, salt, and pepper.', 'Roast vegetables on the center rack for 10 minutes.', 'Pat salmon dry, portion it into four pieces, brush with remaining oil, and season. Move vegetables aside and add salmon skin-side down.', 'Roast 10 to 14 minutes more, until salmon flakes and reaches 145°F. Finish with lemon.'],
  }),
  make({
    id: 'lemon-dill-salmon-potatoes', title: 'Lemon Dill Salmon and Potatoes', summary: 'Crisp potatoes and tender salmon with a fresh lemon finish.', minutes: 42, servings: 4, cuisine: 'Northern European-inspired', tags: ['Sheet pan', 'Dinner'], diets: gfDf,
    ingredients: [i('Salmon', '1 1/2 lb'), i('Potatoes', '1 1/2 lb'), i('Lemons', '1'), i('Dill', '2 tbsp', { optional: true }), i('Olive oil', '2 tbsp', { pantryStaple: true }), ...saltPepper],
    steps: ['Heat the oven to 425°F with a rack in the center. Cut potatoes into 3/4-inch pieces.', 'Toss potatoes with 1 tablespoon oil, salt, and pepper on a rimmed sheet pan. Roast for 20 minutes, turning once.', 'Pat salmon dry, portion it, and season with remaining oil, salt, and pepper.', 'Move potatoes to the sides and place salmon in the center. Roast 10 to 14 minutes, until salmon reaches 145°F.', 'Rest salmon for 2 minutes and finish the pan with lemon juice and optional dill.'],
  }),
  make({
    id: 'shrimp-tomato-rice-skillet', title: 'Shrimp Tomato Rice Skillet', summary: 'Garlicky shrimp and tomatoes folded into fluffy rice.', minutes: 30, servings: 4, cuisine: 'Mediterranean-inspired', tags: ['Skillet', 'Quick'], diets: gfDf,
    ingredients: [i('Shrimp', '1 lb'), i('Cooked rice', '4 cups', { aliases: ['rice'] }), i('Diced tomatoes', '1 can'), i('Spinach', '3 cups', { optional: true }), i('Garlic', '3 cloves'), i('Paprika', '1 tsp', { pantryStaple: true }), oil, ...saltPepper],
    steps: ['Thaw shrimp if frozen, peel if needed, and pat very dry. Season with paprika, salt, and pepper.', 'Heat oil in a skillet over medium-high. Cook shrimp in one layer for 1 to 2 minutes per side, just until opaque, then remove.', 'Lower heat to medium. Add garlic for 30 seconds, then tomatoes and optional spinach.', 'Simmer for 4 minutes. Fold in cooked rice and heat until steaming throughout.', 'Return shrimp only long enough to warm through. Taste, season, and serve immediately.'],
  }),
  make({
    id: 'shrimp-corn-taco-bowls', title: 'Shrimp Corn Taco Bowls', summary: 'Fast taco-seasoned shrimp with corn, rice, and lime.', minutes: 22, servings: 4, cuisine: 'Coastal Tex-Mex', tags: ['Quick', 'Bowl'], diets: gfDf,
    ingredients: [i('Shrimp', '1 lb'), i('Cooked rice', '4 cups', { aliases: ['rice'] }), i('Corn', '2 cups'), i('Salsa', '1 cup'), i('Taco seasoning', '1 1/2 tbsp'), i('Limes', '1'), i('Avocado', '1', { optional: true }), oil],
    steps: ['Pat shrimp dry and toss with taco seasoning. Warm the rice and corn separately.', 'Heat oil in a large skillet over medium-high until shimmering.', 'Cook shrimp in one layer for 1 to 2 minutes per side, until opaque and loosely curled.', 'Remove the skillet from heat and squeeze half the lime over the shrimp.', 'Build bowls with rice, corn, shrimp, salsa, optional avocado, and remaining lime.'],
  }),
  make({
    id: 'tuna-white-bean-salad', title: 'Tuna White Bean Salad', summary: 'A bright no-cook pantry meal with tuna, beans, and lemon.', minutes: 12, servings: 4, cuisine: 'Mediterranean-inspired', tags: ['No-cook', 'Pantry meal'], diets: gfDf,
    ingredients: [i('Canned tuna', '2 cans'), i('White beans', '1 can'), i('Tomatoes', '2'), i('Cucumber', '1'), i('Lemons', '1'), i('Olive oil', '2 tbsp', { pantryStaple: true }), i('Parsley', '2 tbsp', { optional: true }), ...saltPepper],
    steps: ['Drain the tuna. Drain and rinse the beans, then let excess water drip off.', 'Dice tomatoes and cucumber into bite-size pieces and chop optional parsley.', 'Whisk lemon juice, olive oil, salt, and pepper in a large bowl.', 'Add tuna, beans, and vegetables. Fold gently so the beans stay whole.', 'Taste and serve immediately, or chill for up to 30 minutes.'],
  }),
  make({
    id: 'chicken-vegetable-rice-soup', title: 'Chicken Vegetable Rice Soup', summary: 'A gentle, filling soup with chicken, vegetables, and rice.', minutes: 42, servings: 6, cuisine: 'American', tags: ['Soup', 'Comfort food'], diets: gfDf,
    ingredients: [i('Chicken breast', '1 lb'), i('Rice', '3/4 cup'), i('Chicken broth', '8 cups'), i('Carrots', '3'), i('Celery', '3 stalks'), i('Onion', '1'), i('Garlic', '2 cloves'), i('Thyme', '1/2 tsp', { optional: true }), oil, ...saltPepper],
    steps: ['Dice the onion, carrots, and celery. Cut chicken into 1-inch pieces and keep it on a separate board.', 'Heat oil in a soup pot over medium. Cook onion, carrot, and celery for 6 minutes.', 'Add garlic and optional thyme for 30 seconds, then pour in broth and bring to a boil.', 'Stir in rice, reduce to a gentle simmer, and cook for 10 minutes.', 'Add chicken and continue simmering until the rice is tender and chicken reaches 165°F, about 10 to 15 minutes more.', 'Taste the broth, adjust salt and pepper, and serve hot.'],
  }),
  make({
    id: 'beef-vegetable-soup', title: 'Beef and Vegetable Soup', summary: 'A hearty tomato broth with tender beef and everyday vegetables.', minutes: 50, servings: 6, cuisine: 'American', tags: ['Soup', 'One pot'], diets: gfDf,
    ingredients: [i('Ground beef', '1 lb'), i('Potatoes', '1 lb'), i('Frozen mixed vegetables', '3 cups'), i('Diced tomatoes', '1 can'), i('Beef broth', '6 cups'), i('Onion', '1'), i('Italian seasoning', '1 tsp'), ...saltPepper],
    steps: ['Dice the onion and cut potatoes into 1/2-inch cubes.', 'Brown beef and onion in a soup pot over medium-high, breaking up the meat. Cook to 160°F and drain excess grease.', 'Add potatoes, tomatoes, broth, Italian seasoning, salt, and pepper. Bring to a boil.', 'Reduce to a gentle simmer, partially cover, and cook for 15 minutes.', 'Add frozen vegetables and simmer 8 to 10 minutes more, until potatoes are easily pierced.', 'Taste the broth and serve when every component is hot.'],
  }),
  make({
    id: 'three-bean-vegetable-chili', title: 'Three Bean Vegetable Chili', summary: 'A thick, colorful meatless chili built from pantry staples.', minutes: 35, servings: 6, cuisine: 'Southwestern', tags: ['Vegan', 'One pot', 'Budget friendly'], diets: veganGfDf,
    ingredients: [i('Black beans', '1 can'), i('Kidney beans', '1 can'), i('Pinto beans', '1 can'), i('Diced tomatoes', '2 cans'), i('Bell peppers', '1'), i('Onion', '1'), i('Corn', '1 cup'), i('Chili powder', '2 tbsp'), i('Cumin', '1 tsp'), oil, ...saltPepper],
    steps: ['Drain and rinse all beans. Dice the pepper and onion.', 'Heat oil in a soup pot over medium. Cook pepper and onion for 6 minutes, until softened.', 'Add chili powder and cumin and stir for 30 seconds to wake up the spices.', 'Add beans, tomatoes, corn, and 1 cup water. Bring to a boil, then reduce to a gentle simmer.', 'Simmer uncovered for 20 minutes, stirring from the bottom every few minutes. Mash a small scoop of beans to thicken if desired.', 'Taste, adjust seasoning, and serve hot.'],
  }),
  make({
    id: 'red-lentil-coconut-curry', title: 'Red Lentil Coconut Curry', summary: 'Soft lentils in a warmly spiced coconut tomato sauce.', minutes: 35, servings: 4, cuisine: 'Indian-inspired', tags: ['Vegan', 'One pot'], diets: veganGfDf,
    ingredients: [i('Lentils', '1 1/2 cups'), i('Coconut milk', '1 can'), i('Diced tomatoes', '1 can'), i('Vegetable broth', '3 cups'), i('Onion', '1'), i('Garlic', '3 cloves'), i('Curry powder', '2 tbsp'), i('Spinach', '3 cups', { optional: true }), oil, ...saltPepper],
    steps: ['Rinse lentils until the water runs mostly clear. Dice onion and mince garlic.', 'Heat oil in a pot over medium. Cook onion for 5 minutes, then stir in garlic and curry powder for 30 seconds.', 'Add lentils, tomatoes, broth, and coconut milk. Stir well and bring to a boil.', 'Reduce to low and simmer uncovered for 20 to 25 minutes, stirring often near the end so lentils do not stick.', 'When lentils are soft and creamy, fold in optional spinach until wilted.', 'Taste, season, and thin with a splash of water if the curry becomes thicker than you like.'],
  }),
  make({
    id: 'black-bean-sweet-potato-bowls', title: 'Black Bean Sweet Potato Bowls', summary: 'Roasted sweet potatoes, seasoned beans, rice, and lime.', minutes: 38, servings: 4, cuisine: 'Tex-Mex', tags: ['Vegan', 'Bowl', 'Meal prep'], diets: veganGfDf,
    ingredients: [i('Sweet potatoes', '1 1/2 lb'), i('Black beans', '1 can'), i('Cooked rice', '4 cups', { aliases: ['rice'] }), i('Corn', '1 cup'), i('Salsa', '1 cup'), i('Limes', '1'), i('Cumin', '1 tsp'), i('Olive oil', '2 tbsp', { pantryStaple: true }), ...saltPepper],
    steps: ['Heat the oven to 425°F with a rack in the center. Cut sweet potatoes into 3/4-inch cubes.', 'Toss potatoes with oil, cumin, salt, and pepper on a rimmed sheet pan.', 'Roast for 25 to 30 minutes, turning after 15 minutes, until browned and easily pierced.', 'Drain and rinse beans. Warm them with corn and 2 tablespoons water in a small pan.', 'Warm rice and divide it into bowls. Add potatoes, beans, corn, salsa, and lime.'],
  }),
  make({
    id: 'tomato-white-beans-spinach', title: 'Tomato White Beans with Spinach', summary: 'Creamy white beans in a garlicky tomato skillet.', minutes: 22, servings: 4, cuisine: 'Mediterranean-inspired', tags: ['Vegan', 'Pantry meal', 'Skillet'], diets: veganGfDf,
    ingredients: [i('White beans', '2 cans'), i('Diced tomatoes', '1 can'), i('Spinach', '4 cups'), i('Garlic', '3 cloves'), i('Vegetable broth', '1/2 cup'), i('Italian seasoning', '1 tsp'), oil, ...saltPepper],
    steps: ['Drain and rinse the beans and mince the garlic.', 'Heat oil in a large skillet over medium. Add garlic and Italian seasoning for 30 seconds.', 'Add tomatoes, broth, and beans. Bring to a gentle simmer.', 'Simmer uncovered for 10 minutes, stirring occasionally. Mash a few beans against the side to make the sauce creamy.', 'Fold in spinach by handfuls until wilted. Taste and season before serving.'],
  }),
  make({
    id: 'potato-chickpea-spinach-curry', title: 'Potato Chickpea Spinach Curry', summary: 'Tender potatoes and chickpeas in an easy tomato curry.', minutes: 40, servings: 4, cuisine: 'Indian-inspired', tags: ['Vegan', 'One pot'], diets: veganGfDf,
    ingredients: [i('Potatoes', '1 1/2 lb'), i('Chickpeas', '1 can'), i('Diced tomatoes', '1 can'), i('Vegetable broth', '2 cups'), i('Spinach', '3 cups'), i('Onion', '1'), i('Curry powder', '2 tbsp'), oil, ...saltPepper],
    steps: ['Cut potatoes into 3/4-inch cubes, dice the onion, and drain and rinse chickpeas.', 'Heat oil in a deep pot over medium. Cook onion for 5 minutes, then stir in curry powder for 30 seconds.', 'Add potatoes, tomatoes, broth, and chickpeas. Bring to a boil.', 'Reduce to a gentle simmer, cover loosely, and cook 20 to 25 minutes until potatoes are tender.', 'Stir in spinach until wilted. Simmer uncovered for 2 minutes, then taste and season.'],
  }),
  make({
    id: 'vegetable-quinoa-soup', title: 'Vegetable Quinoa Soup', summary: 'A light but filling vegetable soup with protein-rich quinoa.', minutes: 38, servings: 6, cuisine: 'American', tags: ['Vegan', 'Soup', 'Make ahead'], diets: veganGfDf,
    ingredients: [i('Quinoa', '3/4 cup'), i('Vegetable broth', '8 cups'), i('Diced tomatoes', '1 can'), i('Carrots', '3'), i('Celery', '3 stalks'), i('Onion', '1'), i('Frozen mixed vegetables', '2 cups'), i('Italian seasoning', '1 tsp'), oil, ...saltPepper],
    steps: ['Rinse quinoa well. Dice the carrots, celery, and onion into small pieces.', 'Heat oil in a soup pot over medium. Cook carrots, celery, and onion for 6 to 8 minutes.', 'Add tomatoes, broth, quinoa, and Italian seasoning. Bring to a boil.', 'Reduce to a gentle simmer and cook partially covered for 15 minutes.', 'Add frozen vegetables and simmer 5 to 8 minutes more, until quinoa is tender and vegetables are hot.', 'Taste the broth and adjust salt and pepper before serving.'],
  }),
  make({
    id: 'black-bean-corn-avocado-salad', title: 'Black Bean Corn Avocado Salad', summary: 'A bright no-cook salad that works as a meal or side.', minutes: 15, servings: 4, cuisine: 'Tex-Mex', tags: ['Vegan', 'No-cook', 'Quick'], diets: veganGfDf,
    ingredients: [i('Black beans', '1 can'), i('Corn', '2 cups'), i('Avocado', '1'), i('Tomatoes', '2'), i('Bell peppers', '1'), i('Limes', '1'), i('Cilantro', '1/4 cup', { optional: true }), i('Olive oil', '1 tbsp', { pantryStaple: true }), ...saltPepper],
    steps: ['Drain and rinse the beans and drain the corn. Let both dry while you chop the vegetables.', 'Dice avocado, tomatoes, and pepper into bite-size pieces. Chop optional cilantro.', 'Whisk lime juice, olive oil, salt, and pepper in a large bowl.', 'Add beans, corn, tomatoes, pepper, and cilantro and toss gently.', 'Fold in avocado last. Taste and serve right away.'],
  }),
  make({
    id: 'chickpea-lettuce-cups', title: 'Chickpea Lettuce Cups', summary: 'Crunchy, creamy chickpea filling tucked into lettuce leaves.', minutes: 18, servings: 4, cuisine: 'American', tags: ['Vegan', 'No-cook', 'Light'], diets: veganGfDf,
    ingredients: [i('Chickpeas', '2 cans'), i('Lettuce', '12 leaves'), i('Celery', '2 stalks'), i('Vegan mayonnaise', '1/3 cup', { aliases: ['vegan mayo'], dietaryRequirements: ['vegan'] }), i('Mustard', '1 tbsp'), i('Lemons', '1/2'), i('Dill', '1 tbsp', { optional: true }), ...saltPepper],
    steps: ['Drain and rinse chickpeas and dry the lettuce leaves. Finely dice celery.', 'Mash about half the chickpeas in a bowl, leaving the rest whole for texture.', 'Fold in celery, vegan mayonnaise, mustard, lemon juice, optional dill, salt, and pepper.', 'Taste and adjust the mustard or lemon a little at a time.', 'Spoon the filling into lettuce leaves and serve while the leaves are crisp.'],
  }),
  make({
    id: 'tofu-vegetable-stir-fry', title: 'Tofu Vegetable Stir Fry', summary: 'Crisp-edged tofu and vegetables in a quick savory sauce.', minutes: 30, servings: 4, cuisine: 'Asian-inspired', tags: ['Vegan', 'Skillet'], diets: veganAdaptable,
    ingredients: [i('Tofu', '14 oz'), i('Frozen mixed vegetables', '4 cups'), i('Soy sauce', '1/4 cup'), i('Cornstarch', '2 tbsp'), i('Garlic', '2 cloves'), i('Ginger', '1 tbsp', { optional: true }), i('Cooked rice', '4 cups', { aliases: ['rice'], optional: true }), i('Vegetable oil', '2 tbsp', { pantryStaple: true })],
    steps: ['Drain tofu, wrap it in a clean towel, and press under a heavy pan for 10 minutes. Cut into 1-inch cubes.', 'Toss tofu with 1 tablespoon cornstarch. Whisk soy sauce, remaining cornstarch, garlic, optional ginger, and 1/2 cup water.', 'Heat 1 tablespoon oil in a large skillet over medium-high. Brown tofu on several sides, then transfer to a plate.', 'Add remaining oil and vegetables and cook until crisp-tender and hot.', 'Return tofu, stir the sauce, and pour it in. Toss until glossy and thickened. Serve with optional rice.'],
  }),
  make({
    id: 'lentil-bolognese', title: 'Lentil Bolognese', summary: 'A hearty tomato and lentil pasta sauce with no meat required.', minutes: 42, servings: 6, cuisine: 'Italian-inspired', tags: ['Vegan', 'Pasta', 'Budget friendly'], diets: veganAdaptable,
    ingredients: [i('Lentils', '1 cup'), i('Pasta', '16 oz'), i('Crushed tomatoes', '28 oz'), i('Vegetable broth', '3 cups'), i('Carrots', '2'), i('Onion', '1'), i('Garlic', '3 cloves'), i('Italian seasoning', '2 tsp'), oil, ...saltPepper],
    steps: ['Rinse lentils. Finely dice carrots and onion and mince garlic.', 'Heat oil in a deep skillet or pot over medium. Cook carrot and onion for 7 minutes.', 'Stir in garlic and Italian seasoning for 30 seconds. Add lentils, tomatoes, and broth and bring to a simmer.', 'Simmer partially covered for 25 to 30 minutes, stirring occasionally, until lentils are tender.', 'Cook pasta in a large pot of salted boiling water according to the package. Reserve 1/2 cup water, then drain.', 'Taste the sauce and season. Toss with pasta, loosening with reserved water as needed.'],
  }),
  make({
    id: 'vegetable-pasta-primavera', title: 'Vegetable Pasta Primavera', summary: 'Colorful vegetables and pasta in a light garlic sauce.', minutes: 28, servings: 4, cuisine: 'Italian-American', tags: ['Vegetarian', 'Pasta', 'Weeknight'], diets: ['vegetarian', 'vegan', 'dairy-free', 'pork-free', 'nut-free'],
    ingredients: [i('Pasta', '12 oz'), i('Broccoli', '2 cups'), i('Bell peppers', '1'), i('Zucchini', '1'), i('Cherry tomatoes', '2 cups'), i('Garlic', '3 cloves'), i('Lemons', '1'), i('Olive oil', '3 tbsp', { pantryStaple: true }), ...saltPepper],
    steps: ['Bring a large pot of salted water to a rolling boil. Cut all vegetables into bite-size pieces.', 'Cook pasta according to the package. Reserve 1 cup pasta water, then drain without rinsing.', 'While pasta cooks, heat oil in a large skillet over medium-high. Cook broccoli and pepper for 4 minutes.', 'Add zucchini and tomatoes and cook 3 minutes. Lower heat to medium, add garlic, and stir for 30 seconds.', 'Add pasta and 1/2 cup reserved water. Toss until glossy, adding more water as needed.', 'Finish with lemon, salt, and pepper and serve immediately.'],
  }),
  make({
    id: 'mushroom-spinach-risotto', title: 'Mushroom Spinach Risotto', summary: 'Creamy rice with mushrooms and spinach, made without cream.', minutes: 45, servings: 4, cuisine: 'Italian-inspired', tags: ['Vegetarian', 'Stovetop'], diets: veganGfDf, difficulty: 'Moderate',
    ingredients: [i('Rice', '1 1/2 cups'), i('Mushrooms', '12 oz'), i('Spinach', '3 cups'), i('Vegetable broth', '6 cups'), i('Onion', '1/2'), i('Garlic', '2 cloves'), i('Olive oil', '2 tbsp', { pantryStaple: true }), ...saltPepper],
    steps: ['Warm broth in a saucepan over low heat and keep it steaming, not boiling. Slice mushrooms and dice onion.', 'Heat 1 tablespoon oil in a wide pan over medium-high. Brown mushrooms and move them to a plate.', 'Lower to medium, add remaining oil and onion, and cook 4 minutes. Add garlic and rice and stir for 1 minute.', 'Add warm broth 3/4 cup at a time, stirring often and waiting until mostly absorbed before adding more.', 'After about 22 minutes, taste the rice. When creamy but still slightly firm, fold in mushrooms and spinach.', 'Remove from heat, rest for 2 minutes, season, and serve while loose and creamy.'],
  }),
  make({
    id: 'loaded-sweet-potatoes-black-beans', title: 'Loaded Sweet Potatoes with Black Beans', summary: 'Soft baked sweet potatoes topped with warm beans and salsa.', minutes: 50, servings: 4, cuisine: 'Tex-Mex', tags: ['Vegan', 'Oven', 'Hands-off'], diets: veganGfDf,
    ingredients: [i('Sweet potatoes', '4 medium'), i('Black beans', '1 can'), i('Corn', '1 cup'), i('Salsa', '1 cup'), i('Cumin', '1 tsp'), i('Avocado', '1', { optional: true }), ...saltPepper],
    steps: ['Heat the oven to 425°F with a rack in the center. Scrub and dry the sweet potatoes and pierce each several times with a fork.', 'Place potatoes on a rimmed sheet pan and bake 40 to 50 minutes, until a knife slides into the center easily.', 'During the final 10 minutes, drain and rinse beans and warm them with corn, cumin, and 2 tablespoons water.', 'Rest potatoes for 5 minutes. Split them carefully and fluff the inside with a fork.', 'Season and top with the bean mixture, salsa, and optional avocado.'],
  }),
  make({
    id: 'spinach-tomato-egg-bake', title: 'Spinach Tomato Egg Bake', summary: 'A simple oven-baked egg dish for breakfast or dinner.', minutes: 35, servings: 6, cuisine: 'American', tags: ['Vegetarian', 'Breakfast', 'Make ahead'], diets: ['vegetarian', 'gluten-free', 'dairy-free', 'pork-free', 'nut-free'],
    ingredients: [i('Eggs', '10'), i('Spinach', '4 cups'), i('Tomatoes', '2'), i('Onion', '1/2'), i('Feta cheese', '1/2 cup', { optional: true }), i('Olive oil', '1 tbsp', { pantryStaple: true }), ...saltPepper],
    steps: ['Position a rack in the center and heat the oven to 375°F. Lightly oil a 9-inch square baking dish.', 'Dice onion and tomatoes. Cook onion in a skillet over medium for 4 minutes, then add spinach until wilted.', 'Whisk eggs, salt, and pepper in a large bowl until no streaks remain. Fold in vegetables and optional feta.', 'Pour into the dish and bake on the center rack for 20 to 25 minutes.', 'The center should be set, not wet, and reach 160°F. Rest 5 minutes before slicing.'],
  }),
  make({
    id: 'turkey-burger-bowls', title: 'Turkey Burger Bowls', summary: 'Juicy turkey burger patties served with potatoes and crisp toppings.', minutes: 35, servings: 4, cuisine: 'American', tags: ['Bowl', 'Family friendly'], diets: gfDf,
    ingredients: [i('Ground turkey', '1 lb'), i('Potatoes', '1 lb'), i('Lettuce', '4 cups'), i('Tomatoes', '2'), i('Pickles', '1/2 cup'), i('Mustard', '2 tbsp'), i('Garlic powder', '1 tsp', { pantryStaple: true }), i('Olive oil', '2 tbsp', { pantryStaple: true }), ...saltPepper],
    steps: ['Heat the oven to 425°F. Cut potatoes into 3/4-inch cubes and toss with half the oil, salt, and pepper.', 'Roast potatoes on a rimmed sheet pan for 25 to 30 minutes, turning after 15 minutes.', 'Mix turkey with garlic powder, salt, and pepper and shape four equal patties with a shallow dimple in each center.', 'Heat remaining oil in a skillet over medium-high. Cook patties 5 to 6 minutes per side, until the center reaches 165°F.', 'Build bowls with lettuce, tomato, pickles, potatoes, turkey patties, and mustard.'],
  }),
  make({
    id: 'weeknight-chicken-piccata', title: 'Weeknight Chicken Piccata', summary: 'Golden chicken in a bright lemon and caper pan sauce.', minutes: 30, servings: 4, cuisine: 'Italian-American', tags: ['Skillet', 'Weeknight'], diets: ['pork-free', 'nut-free'], difficulty: 'Moderate',
    ingredients: [i('Chicken breast', '1 1/2 lb'), i('Flour', '1/2 cup', { pantryStaple: true }), i('Chicken broth', '1 cup'), i('Lemons', '1'), i('Capers', '2 tbsp'), i('Butter', '2 tbsp', { pantryStaple: true }), i('Olive oil', '1 tbsp', { pantryStaple: true }), ...saltPepper],
    steps: ['Slice thick chicken breasts horizontally into even cutlets. Pat dry and season both sides.', 'Spread flour on a plate and coat chicken lightly, shaking off all excess.', 'Heat oil in a large skillet over medium-high. Sear chicken in batches until golden, then transfer to a clean plate.', 'Add broth, lemon juice, and capers. Scrape the pan and simmer for 3 minutes.', 'Return chicken and simmer until the thickest piece reaches 165°F. Remove from heat and swirl in butter.', 'Taste the sauce and spoon it over the chicken.'],
  }),
  make({
    id: 'oven-salmon-cakes', title: 'Oven-Baked Salmon Cakes', summary: 'Crisp-edged salmon patties that work with canned or cooked salmon.', minutes: 32, servings: 4, cuisine: 'American', tags: ['Seafood', 'Oven'], diets: ['dairy-free', 'pork-free', 'nut-free'],
    ingredients: [i('Salmon', '14 oz cooked or canned', { aliases: ['canned tuna'] }), i('Eggs', '1'), i('Breadcrumbs', '3/4 cup'), i('Mayonnaise', '1/4 cup'), i('Mustard', '1 tbsp'), i('Green onions', '2', { optional: true }), i('Lemons', '1/2'), i('Olive oil', '1 tbsp', { pantryStaple: true }), ...saltPepper],
    steps: ['Heat the oven to 425°F with a rack in the center. Brush a lined rimmed pan with oil.', 'Drain the fish very well. Mix it with egg, breadcrumbs, mayonnaise, mustard, optional green onion, lemon, salt, and pepper.', 'Let the mixture stand for 5 minutes, then shape eight firmly packed patties.', 'Place on the pan, lightly brush the tops with oil, and bake 10 minutes.', 'Flip carefully and bake 6 to 8 minutes more, until browned and hot through. Rest 3 minutes before serving.'],
  }),
  make({
    id: 'shrimp-vegetable-fried-rice', title: 'Shrimp Vegetable Fried Rice', summary: 'A fast skillet meal made with cold rice, shrimp, and vegetables.', minutes: 24, servings: 4, cuisine: 'Asian-inspired', tags: ['Quick', 'One pan'], diets: ['dairy-free', 'pork-free', 'nut-free'],
    ingredients: [i('Shrimp', '1 lb'), i('Cooked rice', '4 cups', { aliases: ['rice'] }), i('Eggs', '2'), i('Frozen mixed vegetables', '2 cups'), i('Soy sauce', '3 tbsp'), i('Vegetable oil', '2 tbsp', { pantryStaple: true }), i('Sesame oil', '1 tsp', { optional: true })],
    steps: ['Pat shrimp dry. Break up cold rice with clean fingers so no large clumps remain.', 'Heat 1 tablespoon oil in a large skillet over medium-high. Cook shrimp until opaque, then move to a plate.', 'Add beaten eggs, scramble just until set, and move them to the plate with the shrimp.', 'Add remaining oil and vegetables. Cook until hot, then add rice and press it into an even layer for 1 minute.', 'Toss with soy sauce and optional sesame oil. Fold shrimp and egg back in and serve immediately.'],
  }),
  make({
    id: 'easy-beef-stroganoff', title: 'Easy Beef Stroganoff', summary: 'Tender beef and mushrooms in a creamy sauce over noodles.', minutes: 35, servings: 4, cuisine: 'American', tags: ['Comfort food', 'Skillet'], diets: ['pork-free', 'nut-free'], difficulty: 'Moderate',
    ingredients: [i('Sirloin steak', '1 lb'), i('Egg noodles', '10 oz', { aliases: ['pasta'] }), i('Mushrooms', '10 oz'), i('Beef broth', '2 cups'), i('Sour cream', '3/4 cup'), i('Onion', '1/2'), i('Flour', '2 tbsp', { pantryStaple: true }), i('Butter', '2 tbsp', { pantryStaple: true }), ...saltPepper],
    steps: ['Bring a large pot of salted water to a boil. Slice beef thinly across the grain, slice mushrooms, and dice onion.', 'Cook noodles according to the package. Reserve 1/2 cup water, drain, and keep warm.', 'Melt half the butter in a hot skillet. Sear beef in batches for 1 to 2 minutes per side and move it to a plate.', 'Lower heat to medium. Add remaining butter, mushrooms, and onion and cook 6 minutes. Sprinkle with flour and stir for 1 minute.', 'Slowly stir in broth and simmer until lightly thickened. Remove from heat for 1 minute, then stir in sour cream so it does not split.', 'Return beef and its juices just long enough to warm through. Season and serve over noodles.'],
  }),
];
