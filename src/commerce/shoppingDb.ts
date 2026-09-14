import type { ShoppingItem } from './hm';
const DB_NAME = 'virtual-dressing-shopping';
const STORE = 'saved-items';
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('storageBlocked'));
  });
}
async function run<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const request = operation(tx.objectStore(STORE));
    tx.oncomplete = () => { db.close(); resolve(request.result); };
    tx.onabort = () => { db.close(); reject(tx.error || new Error('storage')); };
    tx.onerror = () => { db.close(); reject(tx.error || new Error('storage')); };
  });
}
export const getShoppingItems = (): Promise<ShoppingItem[]> =>
  run('readonly', store => store.getAll());
export const saveShoppingItem = (item: ShoppingItem): Promise<IDBValidKey> =>
  run('readwrite', store => store.put(item));
export const deleteShoppingItem = (id: string): Promise<undefined> =>
  run('readwrite', store => store.delete(id));
