export const markets = {
  FR: { locale: 'fr_fr', fr: 'France', en: 'France' },
  ES: { locale: 'es_es', fr: 'Espagne', en: 'Spain' },
  DE: { locale: 'de_de', fr: 'Allemagne', en: 'Germany' },
  IT: { locale: 'it_it', fr: 'Italie', en: 'Italy' },
  GB: { locale: 'en_gb', fr: 'Royaume-Uni', en: 'United Kingdom' },
} as const;
export type Market = keyof typeof markets;
export interface ShoppingItem {
  id: string;
  merchant: 'hm';
  market: Market;
  productId: string;
  url: string;
  name: string;
  size: string;
  color: string;
  image: File;
  addedAt: string;
  source: 'manual';
  availability: 'unknown';
}
export function isMarket(value: unknown): value is Market {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(markets, value);
}
export function parseHmProductUrl(input: string, market: Market): { url: string; productId: string } {
  if (!isMarket(market)) throw new Error('market');
  let url: URL;
  try { url = new URL(input.trim()); } catch { throw new Error('url'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port ||
      !['hm.com', 'www.hm.com', 'www2.hm.com'].includes(url.hostname)) throw new Error('url');
  const match = url.pathname.match(/^\/([a-z]{2}_[a-z]{2})\/productpage\.(\d+)\.html$/);
  if (!match) throw new Error('url');
  if (match[1] !== markets[market].locale) throw new Error('marketMismatch');
  // Retain the product reference, never guess an equivalent in another country's catalogue.
  url.search = '';
  url.hash = '';
  return { url: url.href, productId: match[2] };
}
export function validateGarmentImage(file: File): void {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size <= 0 || file.size > 8 * 1024 * 1024) throw new Error('image');
}
export function createShoppingItem(input: {
  url: string; market: Market; name: string; size: string; color: string; image: File;
}, id: string, now = new Date()): ShoppingItem {
  const parsed = parseHmProductUrl(input.url, input.market);
  validateGarmentImage(input.image);
  const name = input.name.trim(), size = input.size.trim(), color = input.color.trim();
  if (!name || name.length > 120 || !size || size.length > 40 || !color || color.length > 60) throw new Error('details');
  return { id, merchant: 'hm', market: input.market, ...parsed, name, size, color,
    image: input.image, addedAt: now.toISOString(), source: 'manual', availability: 'unknown' };
}
export function purchaseUrl(item: ShoppingItem, market: Market): string | null {
  if (item.market !== market || item.merchant !== 'hm' || item.source !== 'manual') return null;
  try { return parseHmProductUrl(item.url, market).url; } catch { return null; }
}
export function sameShoppingVariant(a: ShoppingItem, b: ShoppingItem): boolean {
  const normalized = (value: string) => value.trim().toLocaleLowerCase();
  return a.market === b.market && a.productId === b.productId &&
    normalized(a.size) === normalized(b.size) && normalized(a.color) === normalized(b.color);
}
