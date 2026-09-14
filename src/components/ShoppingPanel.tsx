import React, { useEffect, useRef, useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import type { WardrobeItem } from '../types';
import { createShoppingItem, isMarket, markets, purchaseUrl, sameShoppingVariant, type Market, type ShoppingItem } from '../commerce/hm';
import { deleteShoppingItem, getShoppingItems, saveShoppingItem } from '../commerce/shoppingDb';

const copy = {
  fr: {
    title: 'Compléter mon dressing', pilot: 'Pilote H&M — ajout manuel',
    intro: 'Enregistrez un article à envisager, essayez-le avec votre tenue, puis retrouvez-le chez H&M.',
    status: 'Catalogue et stock H&M non connectés. Aucun partenariat actif annoncé.',
    country: 'Pays de la boutique / livraison souhaitée', name: 'Nom de l’article', url: 'Lien de la fiche produit H&M',
    size: 'Taille souhaitée', color: 'Couleur souhaitée', image: 'Image du vêtement (JPEG, PNG ou WebP, 8 Mo maximum)',
    imageHelp: 'Utilisez une image que vous êtes autorisée à utiliser. Elle sera envoyée au service IA uniquement lors de l’essayage.',
    add: 'Enregistrer dans mes envies', list: 'Mes envies', empty: 'Aucun article enregistré pour ce pays.',
    storage: 'Enregistré dans ce navigateur, sans synchronisation entre appareils. Les envies ne sont pas ajoutées automatiquement à votre garde-robe.',
    stock: 'Prix, taille, couleur et disponibilité à confirmer chez H&M.',
    try: 'Essayer avec ma tenue', buy: 'Voir / acheter chez H&M', remove: 'Retirer',
    checkout: 'Achat, choix final de la taille, frais de port, livraison et retours gérés par le vendeur.',
    approximation: 'L’essayage est une simulation visuelle, pas une garantie de taille ou de coupe.',
    busy: 'En cours…', saved: 'Article enregistré.', duplicate: 'Cette référence, taille et couleur sont déjà enregistrées.',
    load: 'Impossible de charger vos envies. Rechargez la page avant d’ajouter un article.',
    save: 'Enregistrement impossible. Vérifiez l’espace disponible et les réglages du navigateur.',
    errors: { url: 'Utilisez une fiche produit HTTPS sur hm.com, www.hm.com ou www2.hm.com.',
      market: 'Choisissez un pays proposé.', marketMismatch: 'Le lien correspond à un autre pays. Choisissez ce pays ou copiez le lien de sa boutique.',
      image: 'Choisissez une image JPEG, PNG ou WebP non vide de 8 Mo maximum.',
      details: 'Renseignez le nom, la taille et la couleur.', generic: 'L’opération a échoué. Réessayez.' },
  },
  en: {
    title: 'Complete my wardrobe', pilot: 'H&M pilot — manual entry',
    intro: 'Save an item to consider, try it with your outfit, then find it at H&M.',
    status: 'H&M catalogue and stock are not connected. No active partnership is claimed.',
    country: 'Store country / intended delivery country', name: 'Item name', url: 'H&M product page link',
    size: 'Desired size', color: 'Desired color', image: 'Garment image (JPEG, PNG or WebP, up to 8 MB)',
    imageHelp: 'Use an image you are allowed to use. It is sent to the AI service only when you request a try-on.',
    add: 'Save to my wishlist', list: 'My wishlist', empty: 'No saved items for this country.',
    storage: 'Saved in this browser, without cross-device sync. Wishlist items are not automatically added to your owned wardrobe.',
    stock: 'Confirm price, size, color and availability at H&M.',
    try: 'Try with my outfit', buy: 'View / buy at H&M', remove: 'Remove',
    checkout: 'The seller handles purchase, final size selection, shipping charges, delivery and returns.',
    approximation: 'Try-on is a visual simulation, not a size or fit guarantee.',
    busy: 'Working…', saved: 'Item saved.', duplicate: 'This reference, size and color are already saved.',
    load: 'Could not load your wishlist. Reload the page before adding an item.',
    save: 'Could not save. Check available storage and your browser settings.',
    errors: { url: 'Use an HTTPS product page on hm.com, www.hm.com or www2.hm.com.',
      market: 'Choose a supported country.', marketMismatch: 'The link belongs to another country. Select that country or copy a link from its store.',
      image: 'Choose a non-empty JPEG, PNG or WebP image up to 8 MB.',
      details: 'Enter a name, size and color.', generic: 'The operation failed. Try again.' },
  },
} as const;
type Props = { isLoading: boolean; onTryOn: (file: File, item: WardrobeItem) => Promise<void> };
type CardProps = Props & { item: ShoppingItem; market: Market; language: 'fr' | 'en'; onRemove: () => void; disabled: boolean };
function ItemCard({ item, market, language, onTryOn, onRemove, disabled, isLoading }: CardProps) {
  const text = copy[language];
  const [preview, setPreview] = useState('');
  const [working, setWorking] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const url = URL.createObjectURL(item.image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [item.image]);
  const link = purchaseUrl(item, market);
  const tryOn = async () => {
    if (working || disabled || isLoading) return;
    setWorking(true); setError(false);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(item.image);
      });
      await onTryOn(item.image, { id: 'shopping-' + item.id, name: item.name + ' — ' + item.size + ' / ' + item.color,
        url: dataUrl, file: item.image, isCustom: true, color: item.color });
    } catch { setError(true); } finally { setWorking(false); }
  };
  return <article className="rounded-xl border border-stone-200 bg-white overflow-hidden">
    {preview && <img src={preview} alt={item.name} className="h-48 w-full object-contain bg-stone-50" />}
    <div className="p-3 space-y-2">
      <p className="text-xs text-stone-500">H&M · {markets[item.market][language]}</p>
      <h3 className="font-semibold break-words">{item.name}</h3>
      <p className="text-sm">{item.size} · {item.color}</p>
      <p className="text-xs text-stone-500">{text.stock}</p>
      <button type="button" onClick={tryOn} disabled={disabled || working || isLoading}
        className="w-full rounded-lg bg-stone-950 text-white p-2 text-sm disabled:opacity-40">{working || isLoading ? text.busy : text.try}</button>
      {link && <a href={link} target="_blank" rel="noopener noreferrer"
        className="block text-center rounded-lg border border-stone-300 p-2 text-sm">{text.buy}</a>}
      <button type="button" onClick={onRemove} disabled={disabled || working || isLoading}
        className="text-xs underline disabled:opacity-40">{text.remove}</button>
      {error && <p role="alert" className="text-sm text-red-700">{text.errors.generic}</p>}
    </div>
  </article>;
}
export default function ShoppingPanel({ isLoading, onTryOn }: Props) {
  const { language } = useLocalization();
  const text = copy[language];
  const [market, setMarket] = useState<Market>('FR');
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [name, setName] = useState(''), [url, setUrl] = useState('');
  const [size, setSize] = useState(''), [color, setColor] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const operation = useRef(false);
  useEffect(() => {
    let active = true;
    getShoppingItems().then(rows => {
      if (active) { setItems(rows.filter(item => isMarket(item.market) && item.image instanceof Blob)); setReady(true); }
    }).catch(() => { if (active) setError('load'); });
    return () => { active = false; };
  }, []);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ready || operation.current || isLoading) return;
    setError(''); setNotice('');
    let item: ShoppingItem;
    try {
      if (!image) throw new Error('image');
      item = createShoppingItem({ market, name, url, size, color, image }, crypto.randomUUID());
      if (items.some(existing => sameShoppingVariant(existing, item))) { setNotice('duplicate'); return; }
    } catch (err) { setError(err instanceof Error ? err.message : 'generic'); return; }
    operation.current = true; setBusy(true);
    try {
      await saveShoppingItem(item);
      setItems(prev => [...prev, item]); setName(''); setUrl(''); setSize(''); setColor(''); setImage(null);
      if (fileInput.current) fileInput.current.value = '';
      setNotice('saved');
    } catch { setError('save'); } finally { operation.current = false; setBusy(false); }
  };
  const remove = async (id: string) => {
    if (operation.current || isLoading) return;
    operation.current = true; setBusy(true); setError(''); setNotice('');
    try { await deleteShoppingItem(id); setItems(prev => prev.filter(item => item.id !== id)); }
    catch { setError('save'); } finally { operation.current = false; setBusy(false); }
  };
  const visible = items.filter(item => item.market === market);
  const errorMessage = error === 'load' ? text.load : error === 'save' ? text.save :
    text.errors[error as keyof typeof text.errors] || text.errors.generic;
  const fieldClass = 'w-full rounded-lg border border-stone-200 bg-white p-2 text-sm text-stone-950';
  return <section className="space-y-5">
    <header className="space-y-2">
      <h2 className="text-xl font-serif font-bold">{text.title}</h2>
      <p className="text-xs font-semibold text-amber-900">{text.pilot}</p>
      <p className="text-sm text-stone-600">{text.intro}</p>
      <p className="text-xs text-stone-500">{text.status}</p>
    </header>
    <label className="block text-sm space-y-1"><span>{text.country}</span>
      <select value={market} disabled={busy || isLoading} className={fieldClass}
        onChange={e => { if (isMarket(e.target.value)) { setMarket(e.target.value); setError(''); setNotice(''); } }}>
        {(Object.keys(markets) as Market[]).map(code => <option key={code} value={code}>{markets[code][language]}</option>)}
      </select>
    </label>
    <form onSubmit={save}>
      <fieldset disabled={!ready || busy || isLoading} className="space-y-3 disabled:opacity-60">
        <label className="block text-sm space-y-1"><span>{text.url}</span><input type="url" required value={url} maxLength={2048} onChange={e => setUrl(e.target.value)} className={fieldClass} /></label>
        <label className="block text-sm space-y-1"><span>{text.name}</span><input required value={name} maxLength={120} onChange={e => setName(e.target.value)} className={fieldClass} /></label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block text-sm space-y-1"><span>{text.size}</span><input required value={size} maxLength={40} onChange={e => setSize(e.target.value)} className={fieldClass} /></label>
          <label className="block text-sm space-y-1"><span>{text.color}</span><input required value={color} maxLength={60} onChange={e => setColor(e.target.value)} className={fieldClass} /></label>
        </div>
        <label className="block text-sm space-y-1"><span>{text.image}</span><input ref={fileInput} type="file" required accept="image/jpeg,image/png,image/webp" onChange={e => setImage(e.target.files?.[0] || null)} className="block w-full text-xs" /></label>
        <p className="text-xs text-stone-500">{text.imageHelp}</p>
        <button type="submit" className="w-full p-3 rounded-lg bg-stone-950 text-white text-sm">{busy ? text.busy : text.add}</button>
      </fieldset>
    </form>
    {error && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
    {notice && <p role="status" className="text-sm text-emerald-800">{notice === 'duplicate' ? text.duplicate : text.saved}</p>}
    <h3 className="font-semibold">{text.list} ({visible.length})</h3>
    {!visible.length && <p className="text-sm text-stone-500">{text.empty}</p>}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {visible.map(item => <ItemCard key={item.id} item={item} market={market} language={language}
        isLoading={isLoading} disabled={busy} onTryOn={onTryOn} onRemove={() => remove(item.id)} />)}
    </div>
    <p className="text-xs text-stone-500">{text.storage}</p>
    <p className="text-xs text-stone-500">{text.checkout}</p>
    <p className="text-xs text-stone-500">{text.approximation}</p>
  </section>;
}
