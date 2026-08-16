import type { BarcodeProduct } from '../types';
import { normalizeIngredient } from '../lib/ingredients';

export function barcodeIngredientName(value: string): string {
  const normalized = normalizeIngredient(value);
  const productHints: Array<[RegExp, string]> = [
    [/\b(spaghetti|penne|fettuccine|linguine|rotini|macaroni|pasta)\b(?!\s+sauce)/i, 'pasta'],
    [/\bmarinara|pasta sauce|spaghetti sauce\b/i, 'marinara sauce'],
    [/\bcheddar\b/i, 'cheddar cheese'],
    [/\bmozzarella\b/i, 'mozzarella cheese'],
    [/\bparmesan\b/i, 'parmesan cheese'],
  ];
  const hinted = productHints.find(([pattern]) => pattern.test(value))?.[1];
  const base = hinted ?? (normalized && normalized.length < 45 ? normalized : value.trim());
  const qualifiers = [
    /\b(gluten[ -]?free|gf)\b/i.test(value) ? 'gluten-free' : '',
    /\b(dairy[ -]?free|non[ -]?dairy)\b/i.test(value) ? 'dairy-free' : '',
    /\bvegan\b/i.test(value) ? 'vegan' : '',
  ].filter(Boolean);
  return [...qualifiers, base].join(' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export async function lookupBarcode(barcode: string): Promise<BarcodeProduct | null> {
  const cleaned = barcode.replace(/\D/g, '');
  if (!cleaned) return null;

  const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(cleaned)}.json?fields=code,product_name,brands,image_front_small_url,categories_tags`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) throw new Error('Barcode lookup failed');
  const data = await response.json();
  if (data.status !== 1 || !data.product) return null;

  const rawName = String(data.product.product_name || '').trim();
  const categories: string[] = Array.isArray(data.product.categories_tags) ? data.product.categories_tags : [];
  const fallback = categories.length ? categories[0].replace(/^en:/, '').replace(/-/g, ' ') : '';
  const name = rawName || fallback;
  if (!name) return null;

  return {
    barcode: cleaned,
    name: barcodeIngredientName(name),
    brand: String(data.product.brands || '').split(',')[0]?.trim() || undefined,
    imageUrl: data.product.image_front_small_url || undefined,
  };
}
