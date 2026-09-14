/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Using IndexedDB to store user data to avoid localStorage quota limits.

const DB_NAME = 'vto-app-db';
const LOOKBOOK_STORE_NAME = 'lookbook';
const WARDROBE_STORE_NAME = 'wardrobe_items';
const DB_VERSION = 2; // Incremented version to add the new wardrobe store

export interface LookbookItemRecord {
    id: number;
    dataUrl: string;
    createdAt: Date;
}

export interface WardrobeDbRecord {
    id: number;
    name: string;
    category: string;
    subcategory?: string;
    color?: string;
    material?: string;
    description?: string;
    file: File;
    createdAt: Date;
}

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('Error opening IndexedDB:', request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(LOOKBOOK_STORE_NAME)) {
                const store = db.createObjectStore(LOOKBOOK_STORE_NAME, {
                    keyPath: 'id',
                    autoIncrement: true,
                });
                store.createIndex('createdAt', 'createdAt');
            }
            if (!db.objectStoreNames.contains(WARDROBE_STORE_NAME)) {
                const store = db.createObjectStore(WARDROBE_STORE_NAME, {
                    keyPath: 'id',
                    autoIncrement: true,
                });
                store.createIndex('createdAt', 'createdAt');
            }
        };
    });
};

export const addLookbookItem = async (dataUrl: string): Promise<LookbookItemRecord> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(LOOKBOOK_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(LOOKBOOK_STORE_NAME);
        const newItem = { dataUrl, createdAt: new Date() };
        
        const request = store.add(newItem);

        request.onsuccess = () => {
            resolve({ ...newItem, id: request.result as number, createdAt: newItem.createdAt });
        };

        request.onerror = () => {
            console.error('Error adding item to IndexedDB:', request.error);
            reject(request.error);
        };
    });
};

export const getLookbookItems = async (): Promise<LookbookItemRecord[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(LOOKBOOK_STORE_NAME, 'readonly');
        const store = transaction.objectStore(LOOKBOOK_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            const sortedItems = request.result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            resolve(sortedItems);
        };

        request.onerror = () => {
            console.error('Error getting items from IndexedDB:', request.error);
            reject(request.error);
        };
    });
};

export const deleteLookbookItem = async (id: number): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(LOOKBOOK_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(LOOKBOOK_STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            console.error('Error deleting item from IndexedDB:', request.error);
            reject(request.error);
        };
    });
};

export const addWardrobeItem = async (item: {
    name: string;
    category: string;
    file: File;
    subcategory?: string;
    color?: string;
    material?: string;
    description?: string;
}): Promise<WardrobeDbRecord> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(WARDROBE_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(WARDROBE_STORE_NAME);
        const newItem = { ...item, createdAt: new Date() };
        
        const request = store.add(newItem);

        request.onsuccess = () => {
            resolve({ ...newItem, id: request.result as number });
        };

        request.onerror = () => {
            console.error('Error adding wardrobe item to IndexedDB:', request.error);
            reject(request.error);
        };
    });
};

export const getWardrobeItems = async (): Promise<WardrobeDbRecord[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(WARDROBE_STORE_NAME, 'readonly');
        const store = transaction.objectStore(WARDROBE_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            const sortedItems = request.result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            resolve(sortedItems);
        };

        request.onerror = () => {
            console.error('Error getting wardrobe items from IndexedDB:', request.error);
            reject(request.error);
        };
    });
};

export const deleteWardrobeItem = async (id: number): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(WARDROBE_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(WARDROBE_STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            console.error('Error deleting wardrobe item from IndexedDB:', request.error);
            reject(request.error);
        };
    });
};