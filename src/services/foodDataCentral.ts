import type { IngredientSearchResult } from '../types';

export async function searchUSDAFoods(query: string, signal?: AbortSignal): Promise<IngredientSearchResult[]> {
  const apiKey = import.meta.env.VITE_USDA_API_KEY as string | undefined;
  if (!apiKey || query.trim().length < 2) return [];

  const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      query: query.trim(),
      pageSize: 8,
      dataType: ['Foundation', 'SR Legacy', 'Survey (FNDDS)', 'Branded'],
    }),
  });

  if (!response.ok) return [];
  const data = await response.json();
  const foods = Array.isArray(data.foods) ? data.foods : [];

  return foods
    .map((food: any) => String(food.description || '').trim())
    .filter(Boolean)
    .map((name: string) => ({ name, source: 'usda' as const }));
}
