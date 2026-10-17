/**
 * IndexedDB utility for persisting composer draft media (images & videos).
 * Survives hard browser reloads and tab closures without hitting localStorage quota limits.
 */

export interface DraftMediaRecord {
  id: string; // 'current_draft'
  blob: Blob;
  fileName: string;
  fileSize: string;
  fileType: 'image' | 'video';
  updatedAt: number;
}

const DB_NAME = 'flintzy_composer_db';
const DB_VERSION = 1;
const STORE_NAME = 'draft_media';
const DRAFT_KEY = 'current_draft';

function openDb(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Stores a local file/blob in IndexedDB so it can be recovered after unexpected page reloads.
 */
export async function saveDraftMedia(
  blob: Blob,
  meta: { fileName: string; fileSize: string; fileType: 'image' | 'video' }
): Promise<void> {
  const db = await openDb();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record: DraftMediaRecord = {
        id: DRAFT_KEY,
        blob,
        fileName: meta.fileName,
        fileSize: meta.fileSize,
        fileType: meta.fileType,
        updatedAt: Date.now(),
      };
      store.put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

/**
 * Retrieves the currently saved draft media file/blob from IndexedDB, if any exists.
 */
export async function getDraftMedia(): Promise<DraftMediaRecord | null> {
  const db = await openDb();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(DRAFT_KEY);

      request.onsuccess = () => {
        resolve((request.result as DraftMediaRecord) || null);
      };
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Clears any saved draft media from IndexedDB once a post is scheduled or discarded.
 */
export async function clearDraftMedia(): Promise<void> {
  const db = await openDb();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(DRAFT_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}
