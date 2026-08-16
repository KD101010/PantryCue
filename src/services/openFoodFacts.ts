import type { BarcodeProduct } from '../types';
import { normalizeIngredient } from '../lib/ingredients';

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

  const normalized = normalizeIngredient(name);
  const displayName = normalized && normalized.length < 45 ? normalized : name;

  return {
    barcode: cleaned,
    name: displayName.replace(/\b\w/g, (letter) => letter.toUpperCase()),
    brand: String(data.product.brands || '').split(',')[0]?.trim() || undefined,
    imageUrl: data.product.image_front_small_url || undefined,
  };
}
