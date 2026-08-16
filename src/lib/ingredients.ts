import { categoryKeywords, ingredientAliases, ingredientCatalog } from '../data/ingredientCatalog';

function clean(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[®™]/g, '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\b(organic|natural|fresh|frozen|canned|jarred|shredded|sliced|diced|chopped|large|small|medium|pack|package|pkg)\b/g, ' ')
    .replace(/[^a-z0-9%]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const aliasEntries = Object.entries(ingredientAliases)
  .map(([alias, canonical]) => [clean(alias), canonical] as const)
  .sort((a, b) => b[0].length - a[0].length);

export function normalizeIngredient(value: string): string {
  const normalized = clean(value);
  if (!normalized) return '';

  const exact = ingredientAliases[normalized];
  if (exact) return exact;

  for (const [alias, canonical] of aliasEntries) {
    if (normalized === alias || normalized.includes(` ${alias} `) || normalized.startsWith(`${alias} `) || normalized.endsWith(` ${alias}`)) {
      return canonical;
    }
  }

  for (const [canonical, keywords] of categoryKeywords) {
    if (keywords.some((keyword) => normalized.includes(clean(keyword)))) return canonical;
  }

  const catalogExact = ingredientCatalog.find((ingredient) => clean(ingredient) === normalized);
  if (catalogExact) return catalogExact;

  return normalized
    .replace(/\bbreasts\b/g, 'breast')
    .replace(/\btomatoes\b/g, 'tomato')
    .trim();
}

export function displayIngredient(value: string): string {
  return value
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function splitIngredientInput(value: string): string[] {
  const cleaned = value
    .replace(/\b(i have|i've got|ive got|we have|there is|there are|some|a little|a bit of)\b/gi, ' ')
    .replace(/\b(and then|plus|also)\b/gi, ',')
    .replace(/\band\b/gi, ',');

  return cleaned
    .split(/[,;\n]+/)
    .map((part) => part
      .replace(/^\s*\d+(?:\.\d+)?\s*(?:lb|lbs|oz|ounces?|cups?|cans?|packages?|packs?|bags?|bottles?|jars?|pieces?|pieces of)?\s*/i, '')
      .trim())
    .filter((part) => part.length > 1);
}

export function localIngredientSearch(query: string, limit = 8): string[] {
  const q = clean(query);
  if (q.length < 1) return [];
  const scored = ingredientCatalog
    .map((name) => {
      const n = clean(name);
      let score = 0;
      if (n === q) score = 100;
      else if (n.startsWith(q)) score = 80;
      else if (n.includes(q)) score = 60;
      else if (q.split(' ').every((part) => n.includes(part))) score = 40;
      return { name, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.name.length - b.name.length);

  return Array.from(new Set(scored.map((row) => row.name))).slice(0, limit);
}
