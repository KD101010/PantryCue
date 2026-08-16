import type { DietaryPreference, Recipe, RecipeIngredient, SubstituteOption } from '../types';
import { expandedRecipes } from './expandedRecipes';

const i = (
  name: string,
  amount: string,
  options: Partial<Omit<RecipeIngredient, 'name' | 'amount'>> = {},
): RecipeIngredient => ({ name, amount, ...options });

const r = (
  id: string,
  title: string,
  summary: string,
  minutes: number,
  servings: number,
  cuisine: string,
  tags: string[],
  ingredients: RecipeIngredient[],
  steps: string[],
  diets: DietaryPreference[] = ['pork-free', 'nut-free'],
  difficulty: 'Easy' | 'Moderate' = 'Easy',
): Recipe => ({ id, title, summary, minutes, servings, cuisine, tags, ingredients, steps, diets, difficulty });

const customSub = (label: string, requires: string[], note?: string): SubstituteOption => ({ label, requires, note });

const saltPepper = [i('Salt', 'to taste', { pantryStaple: true }), i('Black pepper', 'to taste', { pantryStaple: true })];
const oil = i('Olive oil', '1 tbsp', { pantryStaple: true });

const coreRecipes: Recipe[] = [
  r('creamy-garlic-chicken-pasta','Creamy Garlic Chicken Pasta','Tender chicken and pasta in a simple creamy garlic sauce.',30,4,'American',['Weeknight','Comfort food'],[
    i('Chicken breast','1 lb'),i('Pasta','12 oz'),i('Heavy cream','1 cup'),i('Parmesan cheese','1/2 cup'),i('Garlic','3 cloves'),oil,...saltPepper
  ],[
    'Cook the pasta in salted water until just tender. Save about 1/2 cup pasta water, then drain.',
    'Cut the chicken into bite-size pieces, season with salt and pepper, and brown it in olive oil over medium-high heat.',
    'Lower the heat and add garlic. Stir for about 30 seconds, just until fragrant.',
    'Pour in the cream and simmer gently for 2 to 3 minutes. Stir in Parmesan until smooth.',
    'Add the pasta and chicken back to the skillet. Loosen with a splash of pasta water if needed and serve hot.'
  ]),
  r('chicken-tacos','Easy Chicken Tacos','Seasoned chicken tucked into warm tortillas with flexible toppings.',25,4,'Tex-Mex',['Quick','Family friendly'],[
    i('Chicken breast','1 lb'),i('Tortillas','8'),i('Taco seasoning','2 tbsp'),i('Cheddar cheese','1 cup',{optional:true}),i('Salsa','1/2 cup',{optional:true}),i('Sour cream','1/2 cup',{optional:true}),oil
  ],[
    'Slice the chicken into thin strips and toss with taco seasoning.',
    'Heat oil in a skillet over medium-high heat and cook chicken until browned and cooked through.',
    'Warm tortillas in a dry skillet or microwave under a damp paper towel.',
    'Fill tortillas with chicken and any cheese, salsa, sour cream, or other toppings you have.'
  ]),
  r('chicken-quesadillas','Chicken Quesadillas','Crisp tortillas filled with chicken and melty cheese.',18,4,'Tex-Mex',['Quick','Leftovers'],[
    i('Tortillas','8'),i('Rotisserie chicken','2 cups',{aliases:['chicken breast']}),i('Cheddar cheese','2 cups'),i('Salsa','1/2 cup',{optional:true}),i('Bell peppers','1',{optional:true}),oil
  ],[
    'Mix chicken with a spoonful of salsa if you have it.',
    'Scatter cheese and chicken over half of each tortilla. Add sliced peppers if using, then fold closed.',
    'Cook in a lightly oiled skillet over medium heat until the first side is golden.',
    'Flip carefully and cook until the second side is crisp and the cheese is melted. Slice and serve.'
  ]),
  r('chicken-fried-rice','Chicken Fried Rice','A fast way to turn cooked rice and leftover chicken into dinner.',20,4,'Asian-inspired',['Quick','Leftovers','One pan'],[
    i('Cooked rice','4 cups',{aliases:['rice']}),i('Rotisserie chicken','2 cups',{aliases:['chicken breast']}),i('Eggs','2'),i('Soy sauce','3 tbsp'),i('Frozen mixed vegetables','2 cups',{aliases:['peas','corn']}),i('Sesame oil','1 tsp',{optional:true}),i('Vegetable oil','1 tbsp',{pantryStaple:true})
  ],[
    'Heat a large skillet over medium-high heat with vegetable oil.',
    'Scramble the eggs quickly, then move them to a plate.',
    'Add vegetables and cook until hot. Stir in chicken and rice and spread the rice across the pan.',
    'Let the rice toast for a minute, then toss with soy sauce and sesame oil if using.',
    'Fold the egg back in and serve immediately.'
  ]),
  r('lemon-chicken-rice','Lemon Chicken and Rice','Bright skillet chicken with fluffy rice and a lemon finish.',35,4,'American',['One pan','Weeknight'],[
    i('Chicken breast','1 lb'),i('Rice','1 cup'),i('Chicken broth','2 cups'),i('Lemons','1'),i('Garlic','2 cloves'),i('Butter','2 tbsp',{pantryStaple:true}),...saltPepper
  ],[
    'Season chicken with salt and pepper and brown it in a deep skillet with 1 tablespoon butter. Transfer to a plate.',
    'Add the remaining butter and garlic, then stir in the rice for about 30 seconds.',
    'Pour in broth and bring to a simmer. Place chicken on top, cover, and cook over low heat until rice is tender and chicken is cooked through.',
    'Squeeze lemon over the skillet and fluff the rice before serving.'
  ]),
  r('chicken-broccoli-casserole','Chicken Broccoli Rice Bake','Creamy chicken, broccoli, rice, and cheese baked until bubbly.',45,6,'American',['Casserole','Family friendly'],[
    i('Rotisserie chicken','3 cups',{aliases:['chicken breast']}),i('Cooked rice','3 cups',{aliases:['rice']}),i('Broccoli','3 cups'),i('Cream of chicken soup','1 can'),i('Milk','1/2 cup'),i('Cheddar cheese','1 1/2 cups'),i('Garlic powder','1 tsp',{pantryStaple:true}),...saltPepper
  ],[
    'Heat the oven to 375°F and lightly grease a casserole dish.',
    'Stir chicken, rice, broccoli, soup, milk, garlic powder, salt, pepper, and half the cheese together.',
    'Spread into the dish and top with the remaining cheese.',
    'Bake until hot and bubbling, about 25 to 30 minutes. Rest for 5 minutes before serving.'
  ]),
  r('chicken-parmesan','Weeknight Chicken Parmesan','Crisp chicken topped with tomato sauce and melted cheese.',40,4,'Italian-American',['Comfort food'],[
    i('Chicken breast','1 1/2 lb'),i('Breadcrumbs','1 cup'),i('Eggs','2'),i('Marinara sauce','2 cups'),i('Mozzarella cheese','1 1/2 cups'),i('Parmesan cheese','1/3 cup'),i('Flour','1/2 cup',{pantryStaple:true}),oil,...saltPepper
  ],[
    'Heat the oven to 425°F. Slice thick chicken breasts horizontally if needed and season them.',
    'Set out flour, beaten eggs, and breadcrumbs mixed with Parmesan. Coat each piece of chicken in that order.',
    'Brown chicken in olive oil until golden on both sides, then transfer to a baking dish.',
    'Spoon marinara over each piece and top with mozzarella.',
    'Bake until the chicken is cooked through and the cheese is melted, about 12 to 15 minutes.'
  ],['pork-free','nut-free'],'Moderate'),
  r('chicken-noodle-soup','Simple Chicken Noodle Soup','A cozy broth-based soup with chicken, vegetables, and noodles.',40,6,'American',['Soup','Comfort food'],[
    i('Rotisserie chicken','3 cups',{aliases:['chicken breast']}),i('Egg noodles','8 oz',{aliases:['pasta']}),i('Chicken broth','8 cups'),i('Carrots','3'),i('Celery','3 stalks'),i('Onion','1'),i('Garlic','2 cloves'),i('Thyme','1/2 tsp',{optional:true}),...saltPepper
  ],[
    'Cook onion, carrots, and celery in a soup pot with a little oil or butter until they begin to soften.',
    'Add garlic and thyme and stir for 30 seconds.',
    'Pour in chicken broth and simmer until the vegetables are tender.',
    'Add noodles and cook according to the package timing.',
    'Stir in chicken for the final few minutes, season to taste, and serve.'
  ]),
  r('sheet-pan-chicken-potatoes','Sheet Pan Chicken and Potatoes','Roasted chicken and potatoes with very little cleanup.',45,4,'American',['Sheet pan','Easy cleanup'],[
    i('Chicken thighs','2 lb',{aliases:['chicken breast']}),i('Potatoes','1 1/2 lb'),i('Onion','1',{optional:true}),i('Paprika','1 tsp',{pantryStaple:true}),i('Garlic powder','1 tsp',{pantryStaple:true}),i('Olive oil','2 tbsp',{pantryStaple:true}),...saltPepper
  ],[
    'Heat the oven to 425°F. Cut potatoes into small chunks and onion into wedges.',
    'Toss potatoes and onion with half the oil and seasonings on a sheet pan.',
    'Rub chicken with the remaining oil and seasonings and place it among the potatoes.',
    'Roast until potatoes are browned and chicken is cooked through, about 35 to 40 minutes.'
  ]),
  r('buffalo-chicken-wraps','Buffalo Chicken Wraps','Spicy chicken wraps with cool ranch and crunchy vegetables.',15,4,'American',['Quick','Leftovers'],[
    i('Rotisserie chicken','2 cups',{aliases:['chicken breast']}),i('Tortillas','4 large'),i('Buffalo sauce','1/2 cup'),i('Ranch dressing','1/3 cup'),i('Cheddar cheese','1 cup',{optional:true}),i('Lettuce','2 cups',{optional:true})
  ],[
    'Warm chicken in a skillet or microwave, then toss it with buffalo sauce.',
    'Lay out tortillas and add lettuce, cheese, chicken, and ranch.',
    'Fold in the sides, roll tightly, and serve whole or sliced in half.'
  ]),

  r('beef-tacos','Classic Beef Tacos','Savory seasoned ground beef with easy taco toppings.',20,4,'Tex-Mex',['Quick','Family friendly'],[
    i('Ground beef','1 lb'),i('Tortillas','8'),i('Taco seasoning','2 tbsp'),i('Cheddar cheese','1 cup',{optional:true}),i('Salsa','1/2 cup',{optional:true}),i('Lettuce','2 cups',{optional:true})
  ],[
    'Brown ground beef in a skillet over medium-high heat and drain excess grease.',
    'Add taco seasoning and a splash of water. Simmer until the beef is well coated.',
    'Warm the tortillas.',
    'Fill with beef and any cheese, salsa, lettuce, or other toppings you have.'
  ]),
  r('cheeseburger-skillet','Cheeseburger Potato Skillet','Ground beef, tender potatoes, and cheddar in one skillet.',35,4,'American',['One pan','Family friendly'],[
    i('Ground beef','1 lb'),i('Potatoes','1 lb'),i('Onion','1/2',{optional:true}),i('Cheddar cheese','1 1/2 cups'),i('Ketchup','2 tbsp',{optional:true}),i('Garlic powder','1 tsp',{pantryStaple:true}),...saltPepper
  ],[
    'Dice potatoes into small pieces. Brown ground beef in a large skillet, then transfer it to a plate.',
    'Add potatoes and onion with a small splash of water. Cover and cook until almost tender.',
    'Return beef to the pan and season with garlic powder, salt, and pepper. Add ketchup if using.',
    'Sprinkle cheese over the top, cover briefly until melted, and serve.'
  ]),
  r('spaghetti-meat-sauce','Spaghetti with Meat Sauce','A dependable family pasta with a rich beef and tomato sauce.',35,6,'Italian-American',['Family friendly','Classic'],[
    i('Ground beef','1 lb'),i('Spaghetti','16 oz',{aliases:['pasta']}),i('Marinara sauce','24 oz'),i('Onion','1/2',{optional:true}),i('Garlic','2 cloves'),i('Italian seasoning','1 tsp'),i('Parmesan cheese','1/2 cup',{optional:true}),...saltPepper
  ],[
    'Fill a large pot with 4 to 6 quarts of water, cover it, and bring it to a rolling boil over high heat while you start the sauce.',
    'Dice the optional onion and mince the garlic. Heat a large skillet over medium-high heat for 1 to 2 minutes.',
    'Add the ground beef and onion. Break the beef into small pieces and cook for 6 to 8 minutes, until browned with no pink remaining and the center reaches 160°F. Carefully spoon off excess grease.',
    'Lower the skillet to medium. Add the garlic and Italian seasoning and stir for 30 seconds, just until fragrant.',
    'Pour in the marinara, stir well, and bring it to a gentle simmer. Reduce to medium-low and cook uncovered for 10 to 15 minutes, stirring from the bottom every few minutes.',
    'Salt the boiling water, add the spaghetti, and stir during the first 30 seconds. Follow the package time and taste one strand a minute early. Reserve 1/2 cup pasta water, then drain without rinsing.',
    'Toss the drained spaghetti with enough sauce to coat it. If the sauce is too thick, stir in reserved pasta water one tablespoon at a time. Taste and adjust salt and pepper.',
    'Divide among warm bowls and add optional Parmesan. Serve immediately while the pasta and sauce are hot.'
  ]),
  r('meatloaf','Simple Homestyle Meatloaf','Tender meatloaf with a sweet-savory ketchup glaze.',60,6,'American',['Comfort food','Make ahead'],[
    i('Ground beef','2 lb'),i('Eggs','2'),i('Breadcrumbs','1 cup'),i('Milk','1/2 cup'),i('Onion','1/2'),i('Ketchup','1/2 cup'),i('Worcestershire sauce','1 tbsp'),i('Garlic powder','1 tsp',{pantryStaple:true}),...saltPepper
  ],[
    'Heat the oven to 375°F and line a rimmed pan or lightly grease a loaf pan.',
    'Mix beef, eggs, breadcrumbs, milk, onion, half the ketchup, Worcestershire, and seasonings just until combined.',
    'Shape into a loaf and spread the remaining ketchup over the top.',
    'Bake until cooked through, about 45 to 55 minutes depending on shape and thickness.',
    'Rest for 10 minutes before slicing.'
  ]),
  r('beef-stir-fry','Beef and Vegetable Stir Fry','Thin beef and vegetables in a quick savory sauce.',25,4,'Asian-inspired',['Quick','One pan'],[
    i('Sirloin steak','1 lb',{aliases:['flank steak','skirt steak']}),i('Frozen mixed vegetables','4 cups',{aliases:['broccoli','bell peppers']}),i('Soy sauce','1/3 cup'),i('Garlic','2 cloves'),i('Cornstarch','1 tbsp'),i('Rice','2 cups cooked',{optional:true}),i('Vegetable oil','1 tbsp',{pantryStaple:true})
  ],[
    'Slice beef thinly across the grain.',
    'Whisk soy sauce, garlic, cornstarch, and 1/3 cup water together.',
    'Sear beef in hot oil in batches so it browns instead of steaming.',
    'Cook vegetables until crisp-tender, then return beef to the pan.',
    'Pour in the sauce and stir until glossy and thickened. Serve with rice if you have it.'
  ]),
  r('beef-broccoli','Beef and Broccoli','Tender beef and broccoli coated in a simple skillet sauce.',25,4,'Asian-inspired',['Quick','Takeout inspired'],[
    i('Sirloin steak','1 lb',{aliases:['flank steak']}),i('Broccoli','4 cups'),i('Soy sauce','1/3 cup'),i('Brown sugar','1 tbsp'),i('Garlic','2 cloves'),i('Cornstarch','1 tbsp'),i('Rice','2 cups cooked',{optional:true}),i('Vegetable oil','1 tbsp',{pantryStaple:true})
  ],[
    'Slice beef very thinly and cut broccoli into bite-size florets.',
    'Whisk soy sauce, brown sugar, garlic, cornstarch, and 1/2 cup water.',
    'Sear beef in a hot skillet, then remove it.',
    'Add broccoli with a splash of water and cover for 2 minutes.',
    'Return beef, pour in sauce, and toss until thick and glossy. Serve with rice.'
  ]),
  r('sloppy-joes','Weeknight Sloppy Joes','Sweet and savory ground beef piled onto toasted buns.',25,4,'American',['Quick','Family friendly'],[
    i('Ground beef','1 lb'),i('Hamburger buns','4'),i('Ketchup','3/4 cup'),i('Mustard','1 tbsp'),i('Worcestershire sauce','1 tbsp'),i('Brown sugar','1 tbsp',{optional:true}),i('Onion','1/2',{optional:true}),...saltPepper
  ],[
    'Brown beef and onion in a skillet. Drain excess grease if needed.',
    'Stir in ketchup, mustard, Worcestershire, brown sugar, salt, and pepper.',
    'Simmer for 8 to 10 minutes until thick and saucy.',
    'Toast buns if you like and spoon the beef mixture on top.'
  ]),
  r('classic-chili','Classic Weeknight Chili','Ground beef, beans, and tomatoes simmered with warm spices.',40,6,'American',['Soup','One pot','Make ahead'],[
    i('Ground beef','1 lb'),i('Kidney beans','2 cans',{aliases:['black beans','pinto beans']}),i('Diced tomatoes','2 cans'),i('Tomato sauce','1 can'),i('Onion','1'),i('Chili powder','2 tbsp'),i('Cumin','1 tsp'),i('Garlic','2 cloves'),...saltPepper
  ],[
    'Brown beef and onion in a soup pot. Drain excess grease.',
    'Add garlic, chili powder, and cumin and stir for 30 seconds.',
    'Add beans, diced tomatoes, and tomato sauce.',
    'Simmer uncovered for 20 to 25 minutes, stirring occasionally.',
    'Taste and adjust seasoning before serving.'
  ],['pork-free','nut-free','gluten-free']),
  r('hamburger-potato-skillet','Hamburger and Potato Skillet','A simple meat-and-potatoes dinner finished with melted cheese.',35,4,'American',['One pan','Budget friendly'],[
    i('Ground beef','1 lb'),i('Potatoes','1 lb'),i('Onion','1/2'),i('Cheddar cheese','1 cup',{optional:true}),i('Paprika','1 tsp',{pantryStaple:true}),i('Garlic powder','1/2 tsp',{pantryStaple:true}),...saltPepper
  ],[
    'Dice potatoes into small, even pieces.',
    'Brown ground beef in a large skillet, then remove it and leave a little fat in the pan.',
    'Cook potatoes and onion covered with a small splash of water until nearly tender.',
    'Return beef, season, and cook uncovered until potatoes brown at the edges.',
    'Top with cheddar if using and cover briefly to melt.'
  ],['pork-free','nut-free','gluten-free']),
  r('taco-soup','Easy Taco Soup','A hearty one-pot soup with beef, beans, corn, and tomatoes.',35,6,'Tex-Mex',['One pot','Family friendly'],[
    i('Ground beef','1 lb'),i('Black beans','1 can'),i('Corn','1 can or 1 1/2 cups'),i('Diced tomatoes','2 cans'),i('Chicken broth','3 cups'),i('Taco seasoning','2 tbsp'),i('Cheddar cheese','1 cup',{optional:true})
  ],[
    'Brown ground beef in a soup pot and drain excess grease.',
    'Add taco seasoning and stir for 30 seconds.',
    'Add beans, corn, tomatoes, and broth.',
    'Simmer for 20 minutes. Taste and adjust seasoning.',
    'Serve with cheese or other toppings if you have them.'
  ],['pork-free','nut-free','gluten-free']),

  r('sausage-pepper-pasta','Sausage and Pepper Pasta','Savory sausage, peppers, and pasta in tomato sauce.',30,5,'Italian-American',['Weeknight','One pan sauce'],[
    i('Italian sausage','1 lb'),i('Pasta','12 oz'),i('Bell peppers','2'),i('Onion','1'),i('Marinara sauce','24 oz'),i('Garlic','2 cloves'),i('Parmesan cheese','1/3 cup',{optional:true})
  ],[
    'Cook pasta until just tender and drain.',
    'Brown sausage in a large skillet, breaking it into bite-size pieces.',
    'Add peppers and onion and cook until softened. Stir in garlic.',
    'Pour in marinara and simmer for 5 minutes.',
    'Toss with pasta and finish with Parmesan if available.'
  ],['nut-free']),
  r('sausage-potato-hash','Sausage Potato Hash','Crispy potatoes, smoky sausage, and peppers in one skillet.',30,4,'American',['One pan','Breakfast for dinner'],[
    i('Smoked sausage','12 oz'),i('Potatoes','1 lb'),i('Bell peppers','1'),i('Onion','1/2'),i('Paprika','1 tsp',{pantryStaple:true}),i('Olive oil','1 tbsp',{pantryStaple:true}),...saltPepper
  ],[
    'Dice potatoes small and slice sausage into coins.',
    'Cook potatoes in oil over medium heat, covered for the first 8 minutes, until nearly tender.',
    'Add sausage, peppers, and onion. Cook uncovered until browned.',
    'Season with paprika, salt, and pepper and serve hot.'
  ],['nut-free','gluten-free']),
  r('pork-chops-apples','Skillet Pork Chops and Apples','Savory pork chops with tender apples and onions.',30,4,'American',['Skillet','Fall favorite'],[
    i('Pork chops','4'),i('Apples','2'),i('Onion','1'),i('Chicken broth','1/2 cup'),i('Butter','2 tbsp',{pantryStaple:true}),i('Thyme','1/2 tsp',{optional:true}),...saltPepper
  ],[
    'Season pork chops and brown them in 1 tablespoon butter over medium-high heat. Transfer to a plate.',
    'Add remaining butter, sliced apples, and onion. Cook until they begin to soften.',
    'Pour in broth and add thyme if using.',
    'Return pork to the skillet, cover, and simmer gently until pork is cooked through and apples are tender.'
  ],['nut-free','gluten-free']),
  r('pulled-pork-sandwiches','Shortcut Pulled Pork Sandwiches','Tender cooked pork warmed with barbecue sauce and piled onto buns.',15,4,'American',['Leftovers','Quick'],[
    i('Pork shoulder','3 cups cooked'),i('Barbecue sauce','1 cup'),i('Hamburger buns','4'),i('Pickles','1/2 cup',{optional:true})
  ],[
    'Shred cooked pork with two forks if needed.',
    'Warm pork and barbecue sauce together in a skillet or saucepan until hot.',
    'Toast buns if desired.',
    'Pile pork onto buns and top with pickles if available.'
  ],['nut-free']),

  r('tomato-pasta','Weeknight Tomato Pasta','Simple pasta in a garlicky tomato sauce.',25,4,'Italian-inspired',['Pantry meal','Vegetarian'],[
    i('Pasta','12 oz'),i('Tomato sauce','24 oz'),i('Garlic','2 cloves'),i('Italian seasoning','1 tsp'),i('Parmesan cheese','1/2 cup',{optional:true}),oil,...saltPepper
  ],[
    'Cook pasta in salted water until just tender.',
    'Warm olive oil in a skillet and cook garlic for about 30 seconds.',
    'Add tomato sauce and Italian seasoning and simmer for 8 to 10 minutes.',
    'Toss with drained pasta and finish with Parmesan if using.'
  ],['vegetarian','pork-free','nut-free']),
  r('stovetop-mac','Creamy Stovetop Mac and Cheese','Fast homemade macaroni with a smooth cheddar sauce.',25,4,'American',['Comfort food','Family friendly','Vegetarian'],[
    i('Elbow macaroni','12 oz',{aliases:['pasta']}),i('Cheddar cheese','2 cups'),i('Milk','2 cups'),i('Butter','3 tbsp',{pantryStaple:true}),i('Flour','2 tbsp',{pantryStaple:true}),i('Garlic powder','1/4 tsp',{pantryStaple:true}),...saltPepper
  ],[
    'Cook macaroni until just tender and drain.',
    'Melt butter in the pot over medium-low heat and stir in flour for 1 minute.',
    'Slowly whisk in milk and cook until slightly thickened.',
    'Turn heat low and stir in cheddar a handful at a time.',
    'Fold in macaroni, season, and serve right away.'
  ],['vegetarian','pork-free','nut-free']),
  r('pesto-pasta','Pesto Pasta','A very fast pasta with pesto and Parmesan.',15,4,'Italian-inspired',['Very quick','Vegetarian'],[
    i('Pasta','12 oz'),i('Pesto','3/4 cup'),i('Parmesan cheese','1/2 cup',{optional:true}),i('Cherry tomatoes','1 cup',{optional:true})
  ],[
    'Cook pasta until just tender and save a small cup of pasta water.',
    'Drain pasta and return it to the warm pot off the heat.',
    'Toss with pesto and enough pasta water to make the sauce glossy.',
    'Fold in tomatoes and Parmesan if using.'
  ],['vegetarian','pork-free']),
  r('baked-ziti','Easy Baked Ziti','Saucy pasta baked with ricotta and bubbling mozzarella.',45,6,'Italian-American',['Casserole','Vegetarian'],[
    i('Pasta','16 oz'),i('Marinara sauce','32 oz'),i('Ricotta cheese','15 oz'),i('Mozzarella cheese','2 cups'),i('Parmesan cheese','1/2 cup',{optional:true}),i('Italian seasoning','1 tsp')
  ],[
    'Heat oven to 375°F and cook pasta a minute or two shy of fully tender.',
    'Mix drained pasta with marinara and Italian seasoning.',
    'Layer half the pasta in a baking dish, dot with ricotta, and add half the mozzarella.',
    'Add remaining pasta and mozzarella. Top with Parmesan if using.',
    'Bake until bubbly and browned at the edges, about 25 minutes.'
  ],['vegetarian','pork-free','nut-free']),
  r('tuna-pasta','Creamy Pantry Tuna Pasta','A quick pantry dinner with tuna, pasta, and a simple cheese sauce.',22,4,'American',['Pantry meal','Quick'],[
    i('Pasta','12 oz'),i('Canned tuna','2 cans',{aliases:['tuna']}),i('Milk','1 cup'),i('Cheddar cheese','1 cup'),i('Butter','2 tbsp',{pantryStaple:true}),i('Garlic powder','1/2 tsp',{pantryStaple:true}),...saltPepper
  ],[
    'Cook pasta until tender and drain.',
    'Melt butter in the pot over low heat. Stir in milk and garlic powder.',
    'Add cheese and stir until melted.',
    'Fold in drained tuna and pasta. Season and serve.'
  ]),
  r('tuna-melts','Tuna Melts','Creamy tuna salad and melted cheese on crisp toast.',15,4,'American',['Quick','Pantry meal'],[
    i('Canned tuna','2 cans'),i('Bread','8 slices'),i('Mayonnaise','1/3 cup'),i('Cheddar cheese','8 slices',{aliases:['cheddar cheese']}),i('Mustard','1 tsp',{optional:true}),i('Pickles','1/4 cup',{optional:true})
  ],[
    'Drain tuna and mix with mayonnaise, mustard, and chopped pickles if using.',
    'Spread tuna mixture on bread and top with cheese.',
    'Broil on a sheet pan until the cheese melts and the bread edges are crisp, watching closely.'
  ]),
  r('grilled-cheese-tomato-soup','Grilled Cheese and Tomato Soup','A classic comfort-food pair that uses pantry basics.',20,4,'American',['Comfort food','Vegetarian'],[
    i('Bread','8 slices'),i('Cheddar cheese','8 slices',{aliases:['cheddar cheese']}),i('Butter','4 tbsp',{pantryStaple:true}),i('Tomato soup','2 cans'),i('Milk','1 cup',{optional:true})
  ],[
    'Warm tomato soup according to the can directions, using milk if you prefer it creamier.',
    'Butter one side of each bread slice and place cheese between unbuttered sides.',
    'Cook sandwiches in a skillet over medium-low heat until golden on both sides and cheese is melted.',
    'Cut sandwiches and serve with hot soup.'
  ],['vegetarian','pork-free','nut-free']),
  r('black-bean-quesadillas','Black Bean Quesadillas','Crisp tortillas filled with seasoned beans and melted cheese.',18,4,'Tex-Mex',['Vegetarian','Budget friendly'],[
    i('Black beans','1 can'),i('Tortillas','8'),i('Cheddar cheese','2 cups'),i('Taco seasoning','1 tbsp'),i('Corn','1/2 cup',{optional:true}),oil
  ],[
    'Drain and rinse beans, then mash about half of them lightly.',
    'Mix beans with taco seasoning and corn if using.',
    'Spread bean mixture and cheese over half of each tortilla and fold.',
    'Cook in a lightly oiled skillet until crisp on both sides and cheese is melted.'
  ],['vegetarian','pork-free','nut-free']),
  r('chickpea-curry','Quick Chickpea Curry','Warm chickpeas and tomatoes simmered with coconut milk and curry spices.',30,4,'Indian-inspired',['Vegetarian','Pantry meal','One pot'],[
    i('Chickpeas','2 cans'),i('Coconut milk','1 can'),i('Diced tomatoes','1 can'),i('Onion','1'),i('Garlic','2 cloves'),i('Curry powder','2 tbsp'),i('Rice','2 cups cooked',{optional:true}),i('Vegetable oil','1 tbsp',{pantryStaple:true}),...saltPepper
  ],[
    'Cook onion in oil until soft. Add garlic and curry powder and stir for 30 seconds.',
    'Add chickpeas, tomatoes, and coconut milk.',
    'Simmer uncovered for 15 to 20 minutes until slightly thickened.',
    'Season to taste and serve with rice if available.'
  ],['vegetarian','vegan','pork-free','dairy-free','nut-free','gluten-free']),
  r('lentil-soup','Simple Lentil Soup','A hearty, inexpensive soup with lentils and vegetables.',45,6,'Mediterranean-inspired',['Vegetarian','One pot','Budget friendly'],[
    i('Lentils','1 1/2 cups'),i('Vegetable broth','6 cups'),i('Diced tomatoes','1 can'),i('Carrots','2'),i('Celery','2 stalks'),i('Onion','1'),i('Garlic','2 cloves'),i('Cumin','1 tsp'),oil,...saltPepper
  ],[
    'Cook onion, carrots, and celery in olive oil until slightly softened.',
    'Add garlic and cumin and stir briefly.',
    'Add lentils, broth, and tomatoes and bring to a simmer.',
    'Cover loosely and cook until lentils are tender, about 25 to 30 minutes.',
    'Season to taste and add a little water if you prefer a thinner soup.'
  ],['vegetarian','vegan','pork-free','dairy-free','nut-free','gluten-free']),
  r('veggie-fried-rice','Vegetable Fried Rice','A quick skillet meal built around leftover rice and vegetables.',18,4,'Asian-inspired',['Vegetarian','Leftovers','Quick'],[
    i('Cooked rice','4 cups',{aliases:['rice']}),i('Eggs','3'),i('Frozen mixed vegetables','3 cups'),i('Soy sauce','3 tbsp'),i('Green onions','3',{optional:true}),i('Sesame oil','1 tsp',{optional:true}),i('Vegetable oil','1 tbsp',{pantryStaple:true})
  ],[
    'Scramble eggs in a hot skillet with a little oil, then move them to a plate.',
    'Cook vegetables until hot and any excess water has evaporated.',
    'Add rice and let it toast against the pan for a minute.',
    'Toss with soy sauce and sesame oil, then fold the eggs back in.',
    'Top with green onions if available.'
  ],['vegetarian','pork-free','nut-free']),
  r('broccoli-cheddar-rice','Broccoli Cheddar Rice Bowls','Creamy cheesy rice with tender broccoli.',30,4,'American',['Vegetarian','Family friendly'],[
    i('Rice','1 1/2 cups dry'),i('Broccoli','3 cups'),i('Cheddar cheese','1 1/2 cups'),i('Milk','1 cup'),i('Butter','2 tbsp',{pantryStaple:true}),i('Garlic powder','1/2 tsp',{pantryStaple:true}),...saltPepper
  ],[
    'Cook rice according to package directions.',
    'Steam or microwave broccoli until bright green and tender.',
    'Stir butter and milk into hot rice over low heat.',
    'Add cheddar a handful at a time until melted, then fold in broccoli.',
    'Season and serve.'
  ],['vegetarian','pork-free','nut-free','gluten-free']),
  r('loaded-potatoes','Loaded Baked Potatoes','Crisp-skinned potatoes with cheese and flexible toppings.',55,4,'American',['Flexible','Vegetarian option'],[
    i('Potatoes','4 large'),i('Cheddar cheese','1 cup'),i('Sour cream','1/2 cup'),i('Butter','4 tbsp',{pantryStaple:true}),i('Broccoli','2 cups',{optional:true}),i('Rotisserie chicken','1 cup',{optional:true}),...saltPepper
  ],[
    'Heat oven to 425°F. Scrub and dry potatoes and pierce them several times with a fork.',
    'Bake until very soft in the center, about 45 to 55 minutes.',
    'Split potatoes and fluff the insides with a fork.',
    'Add butter, cheese, sour cream, and any broccoli or chicken you have.'
  ],['pork-free','nut-free','gluten-free']),
  r('potato-soup','Creamy Potato Soup','Comforting potato soup finished with milk and cheddar.',40,6,'American',['Soup','Comfort food'],[
    i('Potatoes','2 lb'),i('Chicken broth','5 cups'),i('Milk','1 1/2 cups'),i('Cheddar cheese','1 cup'),i('Onion','1'),i('Butter','2 tbsp',{pantryStaple:true}),i('Flour','2 tbsp',{pantryStaple:true}),...saltPepper
  ],[
    'Cook onion in butter in a soup pot until soft. Stir in flour for 1 minute.',
    'Slowly add broth while stirring, then add diced potatoes.',
    'Simmer until potatoes are very tender.',
    'Mash some potatoes against the side of the pot for a thicker texture.',
    'Stir in milk and cheese over low heat. Season and serve.'
  ]),
  r('rice-beans','Seasoned Rice and Beans','A simple pantry dinner with beans, rice, tomatoes, and spices.',30,4,'Latin-inspired',['Budget friendly','Pantry meal','Vegetarian'],[
    i('Rice','1 cup'),i('Black beans','1 can',{aliases:['pinto beans','kidney beans']}),i('Diced tomatoes','1 can'),i('Vegetable broth','2 cups'),i('Cumin','1 tsp'),i('Chili powder','1 tsp'),i('Garlic','2 cloves'),oil,...saltPepper
  ],[
    'Cook garlic in olive oil for 30 seconds.',
    'Stir in rice, cumin, and chili powder.',
    'Add broth and tomatoes, cover, and simmer until rice is nearly tender.',
    'Fold in drained beans and cook until hot and rice is fully tender.',
    'Season to taste.'
  ],['vegetarian','vegan','pork-free','dairy-free','nut-free','gluten-free']),
  r('tortilla-pizzas','Crispy Tortilla Pizzas','Fast personal pizzas with crisp tortilla crusts.',15,4,'American',['Very quick','Kid friendly'],[
    i('Tortillas','4'),i('Pizza sauce','1 cup',{aliases:['marinara sauce']}),i('Mozzarella cheese','2 cups'),i('Pepperoni','1 cup',{optional:true}),i('Italian seasoning','1/2 tsp',{optional:true})
  ],[
    'Heat oven to 425°F and place tortillas on a sheet pan.',
    'Spread each tortilla with a thin layer of sauce.',
    'Top with mozzarella and any toppings you have.',
    'Bake until cheese bubbles and tortilla edges are crisp, about 7 to 9 minutes.'
  ],['nut-free']),
  r('tomato-soup','Creamy Tomato Soup','Smooth tomato soup made from canned tomatoes and pantry basics.',30,4,'American',['Soup','Vegetarian','Pantry meal'],[
    i('Crushed tomatoes','28 oz',{aliases:['diced tomatoes','tomato sauce']}),i('Vegetable broth','2 cups'),i('Milk','1 cup'),i('Onion','1/2'),i('Garlic','2 cloves'),i('Butter','2 tbsp',{pantryStaple:true}),i('Sugar','1 tsp',{pantryStaple:true}),...saltPepper
  ],[
    'Cook onion in butter until soft, then add garlic for 30 seconds.',
    'Add tomatoes, broth, sugar, salt, and pepper and simmer for 15 minutes.',
    'Blend carefully until smooth using an immersion blender or countertop blender.',
    'Return to low heat and stir in milk. Do not boil after adding milk.'
  ],['vegetarian','pork-free','nut-free']),

  r('shrimp-tacos','Shrimp Tacos','Quick seasoned shrimp with tortillas and a bright lime finish.',20,4,'Coastal Tex-Mex',['Quick','Light'],[
    i('Shrimp','1 lb'),i('Tortillas','8'),i('Taco seasoning','1 tbsp'),i('Limes','1'),i('Cabbage','2 cups',{optional:true}),i('Sour cream','1/3 cup',{optional:true}),oil
  ],[
    'Pat shrimp dry and toss with taco seasoning.',
    'Cook shrimp in a hot skillet with olive oil until pink and opaque, about 2 minutes per side depending on size.',
    'Warm tortillas and fill with shrimp.',
    'Finish with lime, cabbage, sour cream, or any toppings you have.'
  ],['pork-free','nut-free']),
  r('garlic-shrimp-pasta','Garlic Butter Shrimp Pasta','Juicy shrimp and pasta tossed with garlic, butter, and lemon.',25,4,'Italian-inspired',['Quick','Date night'],[
    i('Shrimp','1 lb'),i('Pasta','12 oz'),i('Butter','4 tbsp',{pantryStaple:true}),i('Garlic','4 cloves'),i('Lemons','1'),i('Parmesan cheese','1/3 cup',{optional:true}),i('Red pepper flakes','1/4 tsp',{optional:true}),...saltPepper
  ],[
    'Cook pasta until just tender and reserve 1/2 cup pasta water.',
    'Melt half the butter in a skillet and cook shrimp until just opaque. Transfer to a plate.',
    'Add remaining butter and garlic to the skillet and cook briefly.',
    'Add pasta, shrimp, lemon juice, and a splash of pasta water and toss well.',
    'Finish with Parmesan and red pepper flakes if using.'
  ]),
  r('salmon-rice-bowls','Salmon Rice Bowls','Flaky salmon over rice with a simple soy-lime drizzle.',30,4,'Asian-inspired',['Balanced','Weeknight'],[
    i('Salmon','1 1/2 lb'),i('Rice','2 cups cooked'),i('Soy sauce','1/4 cup'),i('Limes','1'),i('Cucumber','1',{optional:true}),i('Avocado','1',{optional:true}),i('Honey','1 tbsp',{optional:true}),i('Sesame oil','1 tsp',{optional:true})
  ],[
    'Heat oven to 425°F. Place salmon on a lined pan and brush with a little soy sauce.',
    'Bake until salmon flakes easily, usually 10 to 14 minutes depending on thickness.',
    'Stir remaining soy sauce with lime, honey, and sesame oil if using.',
    'Divide rice into bowls, add salmon, cucumber and avocado, and drizzle with sauce.'
  ],['pork-free','nut-free','gluten-free']),
  r('fish-tacos','Easy Fish Tacos','Seasoned white fish tucked into warm tortillas with lime.',25,4,'Coastal Tex-Mex',['Quick','Light'],[
    i('White fish','1 1/2 lb',{aliases:['tilapia','cod']}),i('Tortillas','8'),i('Taco seasoning','1 tbsp'),i('Limes','1'),i('Cabbage','2 cups',{optional:true}),i('Sour cream','1/3 cup',{optional:true}),oil
  ],[
    'Pat fish dry and season both sides with taco seasoning.',
    'Cook in olive oil over medium-high heat until opaque and flaky, turning once.',
    'Break fish into large pieces and warm tortillas.',
    'Fill tortillas with fish and finish with lime and any toppings you have.'
  ],['pork-free','nut-free']),

  r('breakfast-burritos','Breakfast Burritos','Eggs, cheese, potatoes, and optional sausage wrapped in tortillas.',30,6,'American',['Breakfast','Freezer friendly'],[
    i('Eggs','8'),i('Tortillas','6 large'),i('Cheddar cheese','1 1/2 cups'),i('Frozen hash browns','3 cups',{aliases:['potatoes']}),i('Breakfast sausage','1/2 lb',{optional:true}),i('Salsa','1/2 cup',{optional:true}),i('Butter','1 tbsp',{pantryStaple:true}),...saltPepper
  ],[
    'Cook hash browns until crisp. Cook sausage separately if using.',
    'Scramble eggs gently in butter and season.',
    'Warm tortillas so they fold without tearing.',
    'Divide eggs, potatoes, cheese, sausage, and salsa among tortillas.',
    'Fold in the sides and roll tightly. Toast seam-side down in a skillet if desired.'
  ],['nut-free']),
  r('pancakes','Fluffy Pantry Pancakes','Classic pancakes made from everyday baking staples.',20,4,'American',['Breakfast','Vegetarian'],[
    i('Flour','1 1/2 cups',{pantryStaple:true}),i('Milk','1 1/4 cups'),i('Eggs','1'),i('Sugar','2 tbsp',{pantryStaple:true}),i('Baking powder','2 tsp'),i('Butter','3 tbsp',{pantryStaple:true}),i('Vanilla extract','1 tsp',{optional:true}),i('Salt','1/2 tsp',{pantryStaple:true})
  ],[
    'Whisk flour, sugar, baking powder, and salt in a bowl.',
    'Whisk milk, egg, melted butter, and vanilla in another bowl.',
    'Stir wet ingredients into dry just until no large dry patches remain. A few lumps are fine.',
    'Cook 1/4-cup portions on a lightly greased skillet over medium heat. Flip when bubbles form and edges look set.'
  ],['vegetarian','pork-free','nut-free']),
  r('french-toast','Cinnamon French Toast','Golden French toast with a simple cinnamon custard.',18,4,'American',['Breakfast','Vegetarian','Quick'],[
    i('Bread','8 slices'),i('Eggs','3'),i('Milk','3/4 cup'),i('Cinnamon','1 tsp'),i('Vanilla extract','1 tsp',{optional:true}),i('Butter','2 tbsp',{pantryStaple:true}),i('Maple syrup','for serving',{optional:true})
  ],[
    'Whisk eggs, milk, cinnamon, and vanilla in a shallow dish.',
    'Dip bread briefly on both sides so it absorbs some custard without falling apart.',
    'Cook in butter over medium heat until golden on both sides.',
    'Serve warm with syrup, fruit, or powdered sugar if available.'
  ],['vegetarian','pork-free','nut-free']),
  r('egg-toast','Cheesy Scrambled Egg Toast','Soft scrambled eggs and melted cheese on toast.',12,2,'American',['Breakfast','Very quick'],[
    i('Eggs','4'),i('Bread','4 slices'),i('Cheddar cheese','1/2 cup'),i('Milk','2 tbsp',{optional:true}),i('Butter','1 tbsp',{pantryStaple:true}),...saltPepper
  ],[
    'Toast the bread.',
    'Whisk eggs with milk if using, salt, and pepper.',
    'Melt butter over medium-low heat and gently scramble eggs until just set.',
    'Stir in cheese, then spoon eggs over toast.'
  ],['vegetarian','pork-free','nut-free']),
  r('breakfast-hash','Egg and Potato Breakfast Hash','Crispy potatoes topped with eggs for a hearty breakfast or dinner.',30,4,'American',['Breakfast','One pan'],[
    i('Potatoes','1 lb'),i('Eggs','6'),i('Onion','1/2',{optional:true}),i('Bell peppers','1',{optional:true}),i('Cheddar cheese','1 cup',{optional:true}),i('Olive oil','1 tbsp',{pantryStaple:true}),...saltPepper
  ],[
    'Dice potatoes small and cook in olive oil over medium heat, covered until almost tender.',
    'Add onion and peppers if using and cook uncovered until browned.',
    'Make small wells and crack eggs into them. Cover and cook until egg whites are set.',
    'Top with cheese if using, season, and serve from the skillet.'
  ],['vegetarian','pork-free','nut-free','gluten-free']),
  r('baked-oatmeal','Cinnamon Baked Oatmeal','Warm baked oats that reheat well for easy breakfasts.',40,6,'American',['Breakfast','Meal prep','Vegetarian'],[
    i('Old fashioned oats','3 cups',{aliases:['oats']}),i('Milk','2 cups'),i('Eggs','2'),i('Brown sugar','1/3 cup'),i('Cinnamon','1 tsp'),i('Baking powder','1 tsp'),i('Butter','3 tbsp',{pantryStaple:true}),i('Apples','1',{optional:true})
  ],[
    'Heat oven to 350°F and grease an 8-inch or similar baking dish.',
    'Mix oats, brown sugar, cinnamon, and baking powder.',
    'Whisk milk, eggs, and melted butter, then stir into the oats.',
    'Fold in diced apple if using and spread into the dish.',
    'Bake until set in the center and lightly browned, about 30 minutes.'
  ],['vegetarian','pork-free','nut-free']),

  r('chicken-caesar-wraps','Chicken Caesar Wraps','Cool crunchy wraps with chicken, romaine, Parmesan, and Caesar dressing.',12,4,'American',['Very quick','Leftovers'],[
    i('Rotisserie chicken','2 cups',{aliases:['chicken breast']}),i('Tortillas','4 large'),i('Romaine lettuce','4 cups',{aliases:['lettuce']}),i('Caesar dressing','1/2 cup'),i('Parmesan cheese','1/3 cup')
  ],[
    'Chop chicken and romaine into bite-size pieces.',
    'Toss chicken and romaine with enough Caesar dressing to coat lightly.',
    'Add Parmesan and divide among tortillas.',
    'Fold in the sides, roll tightly, and serve.'
  ]),
  r('chicken-salad-sandwiches','Chicken Salad Sandwiches','Creamy chicken salad with a little crunch, ready in minutes.',15,4,'American',['No-cook','Leftovers'],[
    i('Rotisserie chicken','3 cups',{aliases:['chicken breast']}),i('Mayonnaise','1/2 cup'),i('Celery','2 stalks',{optional:true}),i('Mustard','1 tsp',{optional:true}),i('Bread','8 slices'),i('Grapes','1/2 cup',{optional:true}),...saltPepper
  ],[
    'Chop or shred chicken.',
    'Mix chicken with mayonnaise, celery, mustard, grapes, salt, and pepper as available.',
    'Taste and adjust the amount of mayonnaise and seasoning.',
    'Serve on bread, toast, crackers, or lettuce.'
  ]),
  r('greek-chicken-bowls','Greek Chicken Bowls','Lemony chicken, rice, cucumber, and feta in fresh bowls.',30,4,'Mediterranean-inspired',['Balanced','Meal prep'],[
    i('Chicken breast','1 lb'),i('Rice','2 cups cooked'),i('Cucumber','1'),i('Tomatoes','2'),i('Feta cheese','1/2 cup'),i('Lemons','1'),i('Oregano','1 tsp'),i('Olive oil','1 tbsp',{pantryStaple:true}),...saltPepper
  ],[
    'Season chicken with oregano, salt, pepper, and half the lemon juice.',
    'Cook chicken in olive oil until browned and cooked through, then rest and slice.',
    'Divide rice into bowls and add cucumber, tomato, chicken, and feta.',
    'Finish with remaining lemon juice and a small drizzle of olive oil.'
  ],['pork-free','nut-free','gluten-free']),
  r('enchilada-skillet','Chicken Enchilada Skillet','Chicken, beans, tortillas, and enchilada sauce finished with melted cheese.',25,5,'Tex-Mex',['One pan','Leftovers'],[
    i('Rotisserie chicken','3 cups',{aliases:['chicken breast']}),i('Tortillas','6'),i('Enchilada sauce','2 cups'),i('Black beans','1 can'),i('Cheddar cheese','1 1/2 cups'),i('Corn','1 cup',{optional:true})
  ],[
    'Cut tortillas into strips and drain the beans.',
    'Warm enchilada sauce in a large skillet and stir in chicken, beans, corn, and tortilla strips.',
    'Cook gently for 5 minutes so the tortillas soften slightly.',
    'Top with cheese, cover, and cook until melted.'
  ],['pork-free','nut-free']),
  r('chicken-pot-pie-skillet','Chicken Pot Pie Skillet','Creamy chicken and vegetables topped with quick biscuits.',40,6,'American',['Comfort food','Family friendly'],[
    i('Rotisserie chicken','3 cups',{aliases:['chicken breast']}),i('Frozen mixed vegetables','3 cups'),i('Cream of chicken soup','2 cans'),i('Milk','1 cup'),i('Biscuits','1 package'),i('Thyme','1/2 tsp',{optional:true}),...saltPepper
  ],[
    'Heat oven to the temperature listed on the biscuit package.',
    'Stir chicken, vegetables, soup, milk, thyme, salt, and pepper in an oven-safe skillet or baking dish.',
    'Warm the filling on the stove or in the oven until steaming.',
    'Arrange biscuits on top and bake until biscuits are golden and cooked through.'
  ]),
  r('pizza-toast','Pizza Toast','Crispy cheesy toast with pizza sauce and whatever toppings are on hand.',12,4,'American',['Very quick','Kid friendly'],[
    i('Bread','8 slices'),i('Pizza sauce','1 cup',{aliases:['marinara sauce']}),i('Mozzarella cheese','2 cups'),i('Pepperoni','1 cup',{optional:true}),i('Italian seasoning','1/2 tsp',{optional:true})
  ],[
    'Heat the broiler and place bread on a sheet pan.',
    'Broil bread briefly on one side until lightly toasted.',
    'Flip, spread with sauce, and add cheese and toppings.',
    'Broil until cheese bubbles, watching closely.'
  ],['nut-free']),
  r('queso-rice-bowls','Cheesy Taco Rice Bowls','Seasoned beef and rice topped with creamy cheddar.',25,4,'Tex-Mex',['Family friendly','Bowls'],[
    i('Ground beef','1 lb'),i('Rice','2 cups cooked'),i('Taco seasoning','2 tbsp'),i('Cheddar cheese','1 1/2 cups'),i('Milk','1/2 cup'),i('Salsa','1/2 cup',{optional:true}),i('Black beans','1 can',{optional:true})
  ],[
    'Brown beef in a skillet and stir in taco seasoning with a splash of water.',
    'Warm rice and beans if using.',
    'Warm milk over low heat and stir in cheddar a handful at a time until smooth.',
    'Build bowls with rice, beef, beans, cheese sauce, and salsa.'
  ],['pork-free','nut-free','gluten-free']),
  r('one-pot-alfredo','One-Pot Chicken Alfredo','A creamy chicken and pasta dinner with minimal cleanup.',35,5,'Italian-American',['One pot','Comfort food'],[
    i('Chicken breast','1 lb'),i('Fettuccine','12 oz',{aliases:['pasta']}),i('Heavy cream','1 cup'),i('Chicken broth','2 1/2 cups'),i('Parmesan cheese','1 cup'),i('Garlic','3 cloves'),i('Butter','2 tbsp',{pantryStaple:true}),...saltPepper
  ],[
    'Cut chicken into bite-size pieces and brown it in butter in a deep skillet. Set aside.',
    'Add garlic, broth, cream, and pasta. Bring to a gentle simmer.',
    'Cook uncovered, stirring often, until pasta is tender and sauce has reduced.',
    'Return chicken and stir in Parmesan off the heat. Season and serve.'
  ]),
  r('chicken-ranch-potatoes','Ranch Chicken and Potatoes','Roasted chicken and potatoes seasoned with ranch-style flavors.',45,4,'American',['Sheet pan','Family friendly'],[
    i('Chicken breast','1 1/2 lb'),i('Potatoes','1 1/2 lb'),i('Ranch dressing','1/2 cup'),i('Garlic powder','1 tsp',{pantryStaple:true}),i('Paprika','1 tsp',{pantryStaple:true}),i('Olive oil','1 tbsp',{pantryStaple:true}),...saltPepper
  ],[
    'Heat oven to 425°F and cut potatoes into bite-size pieces.',
    'Toss potatoes with oil, garlic powder, paprika, salt, and pepper.',
    'Coat chicken lightly with ranch and place it on the sheet pan with potatoes.',
    'Roast until chicken is cooked through and potatoes are browned and tender.'
  ]),
  r('bean-cheese-burritos','Bean and Cheese Burritos','Simple refried-style bean and cheese burritos for a fast meal.',15,4,'Tex-Mex',['Budget friendly','Vegetarian'],[
    i('Pinto beans','2 cans',{aliases:['black beans']}),i('Tortillas','8'),i('Cheddar cheese','2 cups'),i('Salsa','1/2 cup',{optional:true}),i('Cumin','1/2 tsp',{optional:true})
  ],[
    'Drain beans, leaving a little liquid, and mash them in a saucepan over medium heat.',
    'Season with cumin and salt if desired.',
    'Warm tortillas and divide beans and cheese among them.',
    'Roll tightly and toast in a dry skillet seam-side down if you want a crisp exterior.'
  ],['vegetarian','pork-free','nut-free']),
  r('egg-fried-rice','Egg Fried Rice','A fast meatless fried rice for leftover-rice nights.',15,4,'Asian-inspired',['Very quick','Vegetarian','Leftovers'],[
    i('Cooked rice','4 cups',{aliases:['rice']}),i('Eggs','4'),i('Soy sauce','3 tbsp'),i('Frozen peas','1 cup',{aliases:['peas','frozen mixed vegetables']}),i('Green onions','3',{optional:true}),i('Vegetable oil','1 tbsp',{pantryStaple:true})
  ],[
    'Scramble eggs in a hot oiled skillet and move them to a plate.',
    'Add rice and peas and stir-fry until hot, letting some rice toast against the pan.',
    'Add soy sauce and toss well.',
    'Fold eggs back in and top with green onions if available.'
  ],['vegetarian','pork-free','nut-free']),
  r('peanut-noodles','Quick Peanut Noodles','Creamy savory noodles with peanut butter and soy sauce.',15,4,'Asian-inspired',['Very quick','Pantry meal','Vegetarian'],[
    i('Pasta','12 oz',{aliases:['ramen noodles','rice noodles']}),i('Peanut butter','1/2 cup'),i('Soy sauce','1/4 cup'),i('Honey','1 tbsp'),i('Limes','1',{optional:true}),i('Garlic','1 clove',{optional:true}),i('Red pepper flakes','1/4 tsp',{optional:true})
  ],[
    'Cook noodles according to package directions and reserve 1/2 cup cooking water.',
    'Stir peanut butter, soy sauce, honey, lime, garlic, and red pepper flakes together as available.',
    'Add enough hot cooking water to make a smooth sauce.',
    'Toss with noodles and serve warm or at room temperature.'
  ],['vegetarian','pork-free','dairy-free']),
  r('veggie-omelet','Clean-Out-the-Fridge Omelet','A flexible omelet that turns small amounts of vegetables and cheese into a meal.',15,2,'American',['Breakfast','Use it up','Vegetarian'],[
    i('Eggs','4'),i('Cheddar cheese','1/2 cup',{optional:true}),i('Bell peppers','1/2',{optional:true}),i('Onion','1/4',{optional:true}),i('Spinach','1 cup',{optional:true}),i('Mushrooms','1 cup',{optional:true}),i('Butter','1 tbsp',{pantryStaple:true}),...saltPepper
  ],[
    'Chop any vegetables you are using into small pieces and cook them in a little butter until tender.',
    'Whisk eggs with salt and pepper and pour into the skillet.',
    'Cook over medium-low heat, gently pulling cooked egg toward the center.',
    'Add cheese and vegetables to one half, fold, and cook until just set.'
  ],['vegetarian','pork-free','nut-free','gluten-free']),
  r('apple-cinnamon-oats','Apple Cinnamon Oatmeal','Warm oats with apple, cinnamon, and a little brown sugar.',12,2,'American',['Breakfast','Vegetarian','Quick'],[
    i('Oats','1 cup'),i('Milk','2 cups'),i('Apples','1'),i('Cinnamon','1 tsp'),i('Brown sugar','1 tbsp',{optional:true}),i('Butter','1 tsp',{optional:true,pantryStaple:true})
  ],[
    'Dice the apple into small pieces.',
    'Combine oats, milk, apple, and cinnamon in a saucepan.',
    'Simmer gently, stirring often, until oats are creamy and apple is tender.',
    'Finish with brown sugar and butter if using.'
  ],['vegetarian','pork-free','nut-free']),
  r('banana-pancakes','Banana Pancakes','Soft pancakes with mashed banana mixed into the batter.',22,4,'American',['Breakfast','Use it up','Vegetarian'],[
    i('Bananas','2 ripe'),i('Flour','1 1/2 cups',{pantryStaple:true}),i('Milk','1 cup'),i('Eggs','1'),i('Baking powder','2 tsp'),i('Sugar','1 tbsp',{pantryStaple:true}),i('Butter','2 tbsp',{pantryStaple:true}),i('Cinnamon','1/2 tsp',{optional:true})
  ],[
    'Mash bananas in a mixing bowl.',
    'Whisk in milk, egg, and melted butter.',
    'Stir in flour, baking powder, sugar, and cinnamon just until combined.',
    'Cook small pancakes on a lightly greased skillet over medium heat, flipping when bubbles form.'
  ],['vegetarian','pork-free','nut-free']),
  r('tomato-egg-skillet','Tomato Egg Skillet','Eggs gently cooked in a garlicky tomato sauce.',25,4,'Mediterranean-inspired',['Vegetarian','One pan','Pantry meal'],[
    i('Eggs','6'),i('Diced tomatoes','2 cans'),i('Onion','1/2'),i('Garlic','2 cloves'),i('Paprika','1 tsp',{pantryStaple:true}),i('Cumin','1/2 tsp'),oil,...saltPepper
  ],[
    'Cook onion in olive oil until soft. Add garlic, paprika, and cumin and stir briefly.',
    'Add tomatoes and simmer until the sauce thickens slightly, about 10 minutes.',
    'Make small wells in the sauce and crack in the eggs.',
    'Cover and cook until whites are set and yolks are done to your liking.'
  ],['vegetarian','pork-free','nut-free','gluten-free','dairy-free']),
  r('white-bean-pasta','Garlic White Bean Pasta','Creamy white beans and pasta with garlic and Parmesan.',25,4,'Italian-inspired',['Pantry meal','Vegetarian'],[
    i('Pasta','12 oz'),i('White beans','2 cans'),i('Garlic','3 cloves'),i('Vegetable broth','1 cup'),i('Parmesan cheese','1/2 cup'),i('Spinach','2 cups',{optional:true}),oil,...saltPepper
  ],[
    'Cook pasta until just tender and reserve some cooking water.',
    'Cook garlic briefly in olive oil, then add drained white beans and broth.',
    'Mash a few beans to make the sauce creamier and simmer for 3 to 4 minutes.',
    'Add pasta and spinach if using. Stir in Parmesan and enough pasta water to loosen the sauce.'
  ],['vegetarian','pork-free','nut-free']),
  r('bbq-chicken-potatoes','BBQ Chicken Loaded Potatoes','Baked potatoes piled with barbecue chicken and cheddar.',55,4,'American',['Leftovers','Family friendly'],[
    i('Potatoes','4 large'),i('Rotisserie chicken','2 cups',{aliases:['chicken breast']}),i('Barbecue sauce','3/4 cup'),i('Cheddar cheese','1 cup'),i('Sour cream','1/2 cup',{optional:true})
  ],[
    'Bake potatoes at 425°F until very soft, about 45 to 55 minutes.',
    'Warm chicken with barbecue sauce.',
    'Split potatoes, fluff the insides, and top with barbecue chicken and cheese.',
    'Return to the oven for a few minutes to melt the cheese and add sour cream if using.'
  ],['pork-free','nut-free','gluten-free']),
  r('chicken-salsa-rice','Salsa Chicken Rice Skillet','Chicken, salsa, rice, beans, and cheese cooked in one skillet.',35,5,'Tex-Mex',['One pan','Family friendly'],[
    i('Chicken breast','1 lb'),i('Rice','1 cup'),i('Salsa','1 1/2 cups'),i('Chicken broth','1 1/2 cups'),i('Black beans','1 can'),i('Cheddar cheese','1 cup',{optional:true}),i('Taco seasoning','1 tbsp'),oil
  ],[
    'Cut chicken into bite-size pieces, season with taco seasoning, and brown in oil.',
    'Stir in rice, salsa, and broth. Bring to a simmer.',
    'Cover and cook over low heat until rice is nearly tender.',
    'Fold in drained beans and cook until hot.',
    'Top with cheese if using, cover briefly to melt, and serve.'
  ],['pork-free','nut-free','gluten-free']),
  r('creamy-tomato-chicken','Creamy Tomato Chicken','Pan-seared chicken in a creamy tomato sauce.',30,4,'Italian-inspired',['Skillet','Weeknight'],[
    i('Chicken breast','1 1/2 lb'),i('Tomato sauce','1 1/2 cups'),i('Heavy cream','3/4 cup'),i('Garlic','2 cloves'),i('Parmesan cheese','1/3 cup',{optional:true}),i('Italian seasoning','1 tsp'),oil,...saltPepper
  ],[
    'Season chicken and sear in olive oil over medium-high heat until browned. Transfer to a plate.',
    'Lower the heat and cook garlic briefly.',
    'Add tomato sauce, cream, and Italian seasoning and bring to a gentle simmer.',
    'Return chicken and simmer until cooked through.',
    'Stir in Parmesan if using and serve with pasta, rice, or bread.'
  ]),
  r('turkey-wraps','Turkey Cheddar Wraps','Simple deli turkey wraps with cheese and crunchy vegetables.',10,4,'American',['No-cook','Very quick'],[
    i('Deli turkey','12 oz'),i('Tortillas','4 large'),i('Cheddar cheese','8 slices',{aliases:['cheddar cheese']}),i('Lettuce','2 cups',{optional:true}),i('Mustard','2 tbsp',{optional:true}),i('Mayonnaise','2 tbsp',{optional:true})
  ],[
    'Lay tortillas flat and spread with mustard or mayonnaise if using.',
    'Add turkey, cheese, and lettuce.',
    'Fold in the sides and roll tightly. Slice in half to serve.'
  ]),
  r('ham-cheese-omelet','Ham and Cheese Omelet','A classic omelet that uses leftover ham and cheese.',12,2,'American',['Breakfast','Quick','Use it up'],[
    i('Eggs','4'),i('Ham','1/2 cup'),i('Cheddar cheese','1/2 cup'),i('Butter','1 tbsp',{pantryStaple:true}),...saltPepper
  ],[
    'Whisk eggs with salt and pepper.',
    'Warm ham briefly in a buttered nonstick skillet.',
    'Pour in eggs and cook over medium-low heat, pulling set edges toward the center.',
    'Add cheese and ham to one side, fold, and cook until just set.'
  ],['nut-free','gluten-free']),
  r('chicken-pita-pockets','Chicken Pita Pockets','Chicken, vegetables, and yogurt sauce tucked into pita bread.',15,4,'Mediterranean-inspired',['Quick','Leftovers'],[
    i('Rotisserie chicken','2 cups',{aliases:['chicken breast']}),i('Pita bread','4'),i('Greek yogurt','1/2 cup'),i('Cucumber','1'),i('Tomatoes','2'),i('Lemons','1'),i('Garlic powder','1/4 tsp',{pantryStaple:true}),...saltPepper
  ],[
    'Mix Greek yogurt with lemon juice, garlic powder, salt, and pepper.',
    'Warm pita bread and cut pockets if needed.',
    'Fill with chicken, cucumber, and tomato.',
    'Spoon yogurt sauce over the filling and serve.'
  ]),
];

export const recipes: Recipe[] = [...coreRecipes, ...expandedRecipes];

export const recipeCount = recipes.length;
