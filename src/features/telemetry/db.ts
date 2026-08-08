export interface LearningEvent {
  id: string;
  occurredAt: string;
  sessionId: string;
  missionId: string;
  type:
    | "mission_started"
    | "settings_changed"
    | "capture_taken"
    | "hint_opened"
    | "mission_completed"
    | "mission_repeated";
  payload: Record<string, string | number | boolean | null>;
}

const DB_NAME = "cameralab";
const STORE = "learning-events";
const VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function putEvent(event: LearningEvent): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(event);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Never block mission - swallow errors
  }
}

export async function getAllEvents(): Promise<LearningEvent[]> {
  try {
    const db = await openDB();
    const events: LearningEvent[] = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result as LearningEvent[]);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return events;
  } catch {
    return [];
  }
}

export async function clearEvents(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {}
}

export const TELEMETRY_DB = DB_NAME;
export const TELEMETRY_STORE = STORE;
