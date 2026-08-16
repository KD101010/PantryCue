import type { CookingGuideStep, Recipe } from '../types';

const rawMeatPattern = /chicken|turkey|ground beef|steak|pork|sausage|salmon|fish|tilapia|cod|shrimp/i;

function recipeText(recipe: Recipe): string {
  return `${recipe.title} ${recipe.tags.join(' ')} ${recipe.ingredients.map((ingredient) => ingredient.name).join(' ')} ${recipe.steps.join(' ')}`.toLowerCase();
}

function appendDetail(instruction: string, detail: string, signal: RegExp): string {
  return signal.test(instruction) ? instruction : `${instruction} ${detail}`;
}

function enhanceInstruction(step: string, recipe: Recipe): string {
  const lower = step.toLowerCase();
  const all = recipeText(recipe);
  let instruction = step.trim();

  if (/heat the oven|preheat/.test(lower)) {
    const rack = /broil/.test(all) ? 'Position a rack in the upper third for broiling.' : 'Position a rack in the center so heat can circulate evenly.';
    instruction = appendDetail(instruction, `${rack} Let the oven fully preheat before the food goes in.`, /rack|fully preheat/i);
  }

  if (/(cook|boil).*(pasta|spaghetti|noodles)|(?:pasta|spaghetti|noodles).*(?:cook|boil)/.test(lower)) {
    if (/soup|broth/.test(all) && /add|stir/.test(lower)) {
      instruction = appendDetail(instruction, 'Keep the broth at a steady but not violent boil, stir once after adding the noodles, and begin checking one minute before the package time so they do not turn soft.', /package time|package timing|checking one minute/i);
    } else {
      instruction = appendDetail(instruction, 'Use a large pot with 4 to 6 quarts of water. Bring it to a rolling boil over high heat, salt the water, add the pasta, and stir during the first 30 seconds. Follow the package time and taste a piece one minute early. Reserve 1/2 cup cooking water, then drain in a colander without rinsing.', /rolling boil|4 to 6 quarts|reserve .*cooking water/i);
    }
  }

  if (/brown|sear/.test(lower)) {
    instruction = appendDetail(instruction, 'Preheat the skillet for 1 to 2 minutes, then use medium-high heat. Leave space between pieces so they brown instead of steaming.', /preheat the skillet|medium-high heat/i);
  }

  if (/ground beef/.test(all) && /(brown|cook|simmer|return beef)/.test(lower)) {
    instruction = appendDetail(instruction, 'Break the meat into small pieces and cook until no pink remains and the center reaches 160°F on an instant-read thermometer.', /160°F|160 F/i);
  }

  if (/chicken|ground turkey/.test(all) && /(cook|bake|roast|simmer|sear|brown)/.test(lower)) {
    instruction = appendDetail(instruction, 'Check the thickest piece with an instant-read thermometer; chicken and ground turkey are done at 165°F.', /165°F|165 F/i);
  }

  if (/pork chop|pork tenderloin|pork loin/.test(all) && /(cook|bake|roast|sear)/.test(lower)) {
    instruction = appendDetail(instruction, 'Cook whole cuts of pork to 145°F, then rest them for at least 3 minutes before slicing.', /145°F|145 F/i);
  } else if (/ground pork|sausage/.test(all) && /(cook|brown|bake)/.test(lower)) {
    instruction = appendDetail(instruction, 'Cook ground pork or sausage until the center reaches 160°F.', /160°F|160 F/i);
  }

  if (/salmon|tilapia|cod|white fish|fish sticks/.test(all) && /(cook|bake|roast|sear)/.test(lower)) {
    instruction = appendDetail(instruction, 'Fish is ready when it flakes easily and reaches 145°F at the thickest point.', /145°F|145 F/i);
  }

  if (/shrimp/.test(all) && /(cook|sauté|saute|sear)/.test(lower)) {
    instruction = appendDetail(instruction, 'Cook just until the shrimp are opaque and form a loose C shape; tightly curled shrimp are usually overcooked.', /opaque|C shape/i);
  }

  if (/simmer/.test(lower)) {
    instruction = appendDetail(instruction, 'Once bubbling, lower the heat until only small bubbles regularly break the surface. Stir from the bottom every few minutes.', /small bubbles|gentle bubbles/i);
  }

  if (/(bake|roast)/.test(lower) && !/rack/.test(instruction)) {
    instruction = appendDetail(instruction, 'Place the pan on the center rack unless the step says otherwise, and start checking at the earliest listed time.', /center rack/i);
  }

  if (/rice/.test(all) && /(cover.*cook|cook.*cover)/.test(lower)) {
    instruction = appendDetail(instruction, 'Keep the lid closed and use low heat so the liquid absorbs evenly. When the time is up, remove the pan from heat and let it stand covered for 5 minutes before fluffing.', /stand covered|rest.*covered/i);
  }

  return instruction;
}

function phaseFor(step: string, index: number, total: number): CookingGuideStep['phase'] {
  if (index === total - 1 && /serve|plate|slice|finish|top|garnish/.test(step.toLowerCase())) return 'Serve';
  if (/taste|season|rest|drain|fold|stir in|top|finish/.test(step.toLowerCase())) return 'Finish';
  if (/chop|slice|dice|mix|whisk|combine|heat the oven|preheat/.test(step.toLowerCase()) && index < 2) return 'Prep';
  return 'Cook';
}

function titleFor(step: string, phase: CookingGuideStep['phase']): string {
  const lower = step.toLowerCase();
  if (/heat the oven|preheat/.test(lower)) return 'Heat the oven';
  if (/pasta|spaghetti|noodles/.test(lower) && /cook|boil/.test(lower)) return 'Cook the pasta';
  if (/brown|sear/.test(lower)) return 'Build color';
  if (/simmer/.test(lower)) return 'Simmer gently';
  if (/bake/.test(lower)) return 'Bake and check';
  if (/roast/.test(lower)) return 'Roast and check';
  if (/mix|whisk|combine/.test(lower)) return 'Mix evenly';
  if (/chop|slice|dice|cut/.test(lower)) return 'Prepare the ingredients';
  if (/serve|plate|garnish|top/.test(lower)) return 'Finish and serve';
  if (/rest/.test(lower)) return 'Let it rest';
  return phase === 'Finish' ? 'Finish the dish' : phase === 'Serve' ? 'Serve' : 'Cook the next part';
}

function safetyTip(recipe: Recipe): string | undefined {
  const all = recipeText(recipe);
  if (/chicken|ground turkey/.test(all)) return 'Food-safety check: 165°F for chicken and ground turkey.';
  if (/ground beef|ground pork|sausage/.test(all)) return 'Food-safety check: 160°F for ground meat.';
  if (/pork chop|pork tenderloin|steak|salmon|tilapia|cod|white fish/.test(all)) return 'Food-safety check: 145°F, with a 3-minute rest for whole cuts of beef or pork.';
  return undefined;
}

export function inferEquipment(recipe: Recipe): string[] {
  const all = recipeText(recipe);
  const equipment = new Set(recipe.equipment ?? []);

  if (/oven|bake|roast|broil/.test(all)) equipment.add('Oven');
  if (/sheet pan/.test(all)) equipment.add('Rimmed sheet pan');
  if (/casserole|baking dish/.test(all)) equipment.add('Baking dish');
  if (/skillet|sear|brown|sauté|saute|stir fry/.test(all)) equipment.add('Large skillet');
  if (/soup|stew|chili/.test(all)) equipment.add('Soup pot or Dutch oven');
  if (/pasta|spaghetti|noodles/.test(all) && !/no-cook/.test(all)) {
    equipment.add('Large pot');
    if (!/soup/.test(all)) equipment.add('Colander');
  }
  if (/rice/.test(all) && !/cooked rice/.test(all) && !/skillet|soup|stew/.test(all)) equipment.add('Medium saucepan with lid');
  if (/mix|whisk|combine|toss/.test(all)) equipment.add('Mixing bowl');
  if (/chop|slice|dice|cut|onion|garlic|carrot|pepper|potato/.test(all)) equipment.add('Cutting board and knife');
  if (rawMeatPattern.test(all)) equipment.add('Instant-read thermometer');

  return Array.from(equipment);
}

export function buildCookingGuide(recipe: Recipe): CookingGuideStep[] {
  const equipment = inferEquipment(recipe);
  const all = recipeText(recipe);
  const prepInstruction = [
    `Read every step and set out: ${equipment.join(', ')}.`,
    'Wash and dry produce, measure the ingredients, and open cans or jars before heating the pan.',
    rawMeatPattern.test(all) ? 'Keep raw meat or seafood separate from ready-to-eat food, then wash your hands, knife, and cutting board.' : '',
  ].filter(Boolean).join(' ');

  const guide: CookingGuideStep[] = [
    {
      phase: 'Prep',
      title: 'Set up before you cook',
      instruction: prepInstruction,
      tip: 'A few minutes of setup makes every later step calmer and safer.',
    },
  ];

  recipe.steps.forEach((step, index) => {
    const phase = phaseFor(step, index, recipe.steps.length);
    guide.push({
      phase,
      title: titleFor(step, phase),
      instruction: enhanceInstruction(step, recipe),
      tip: index === recipe.steps.length - 1 ? safetyTip(recipe) : undefined,
    });
  });

  guide.push({
    phase: 'Serve',
    title: 'Taste, rest, and serve',
    instruction: rawMeatPattern.test(all)
      ? 'Confirm the safe temperature listed in the cooking steps. Let the food rest if directed, taste the sauce or sides, then adjust salt and pepper a little at a time. Plate while hot.'
      : 'Taste the finished dish, then adjust salt, pepper, acidity, or spice a little at a time. Add any optional toppings and serve at the temperature you prefer.',
    tip: 'Refrigerate leftovers within 2 hours in shallow, covered containers.',
  });

  return guide;
}
