import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { SRSItem, UserProgress, UserSettings, QuizResult } from '../types';
import { greekAlphabet } from '../data/alphabet';
import { nounEndings } from '../data/nounEndings';
import { verbEndings } from '../data/verbEndings';

interface KryptoDBSchema extends DBSchema {
  settings: {
    key: string;
    value: UserSettings;
  };
  progress: {
    key: string;
    value: UserProgress;
  };
  srsItems: {
    key: string;
    value: SRSItem;
    indexes: { 'by-type': string; 'by-next-review': number };
  };
  quizHistory: {
    key: string;
    value: QuizResult;
    indexes: { 'by-timestamp': number; 'by-item': string };
  };
}

const DB_NAME = 'krypto-greek';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<KryptoDBSchema> | null = null;

export async function getDB(): Promise<IDBPDatabase<KryptoDBSchema>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<KryptoDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }

      // Progress store
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress');
      }

      // SRS Items store
      if (!db.objectStoreNames.contains('srsItems')) {
        const srsStore = db.createObjectStore('srsItems', { keyPath: 'id' });
        srsStore.createIndex('by-type', 'itemType');
        srsStore.createIndex('by-next-review', 'nextReviewDate');
      }

      // Quiz History store
      if (!db.objectStoreNames.contains('quizHistory')) {
        const historyStore = db.createObjectStore('quizHistory', { keyPath: 'questionId' });
        historyStore.createIndex('by-timestamp', 'timestamp');
        historyStore.createIndex('by-item', 'itemId');
      }
    },
  });

  return dbInstance;
}

// Default settings
const defaultSettings: UserSettings = {
  darkMode: true,
  soundEnabled: true,
  hapticFeedback: true,
  showPhoneticGuide: true,
  quizSize: 10,
};

// Default progress
const defaultProgress: UserProgress = {
  alphabet: {
    totalLetters: 24,
    masteredLetters: 0,
    learningLetters: 0,
    notStartedLetters: 24,
    overallAccuracy: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastPracticeDate: 0,
  },
  parsing: {
    nounsUnlocked: false,
    verbsUnlocked: false,
    nounAccuracy: 0,
    verbAccuracy: 0,
    nounsMastered: 0,
    verbsMastered: 0,
    totalNounEndings: nounEndings.length,
    totalVerbEndings: verbEndings.length,
  },
  totalQuizzesTaken: 0,
  totalTimeSpentMs: 0,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

// Settings functions
export async function getSettings(): Promise<UserSettings> {
  const db = await getDB();
  const settings = await db.get('settings', 'user');
  return settings || defaultSettings;
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  const db = await getDB();
  await db.put('settings', settings, 'user');
}

export async function updateSettings(partial: Partial<UserSettings>): Promise<UserSettings> {
  const current = await getSettings();
  const updated = { ...current, ...partial };
  await saveSettings(updated);
  return updated;
}

// Progress functions
export async function getProgress(): Promise<UserProgress> {
  const db = await getDB();
  const progress = await db.get('progress', 'user');
  return progress || defaultProgress;
}

export async function saveProgress(progress: UserProgress): Promise<void> {
  const db = await getDB();
  progress.updatedAt = Date.now();
  await db.put('progress', progress, 'user');
}

export async function updateProgress(partial: Partial<UserProgress>): Promise<UserProgress> {
  const current = await getProgress();
  const updated = { ...current, ...partial, updatedAt: Date.now() };
  await saveProgress(updated);
  return updated;
}

// SRS Item functions
export async function getSRSItem(id: string): Promise<SRSItem | undefined> {
  const db = await getDB();
  return db.get('srsItems', id);
}

export async function getAllSRSItems(): Promise<SRSItem[]> {
  const db = await getDB();
  return db.getAll('srsItems');
}

export async function getSRSItemsByType(type: 'letter' | 'noun-ending' | 'verb-ending'): Promise<SRSItem[]> {
  const db = await getDB();
  return db.getAllFromIndex('srsItems', 'by-type', type);
}

export async function getDueItems(type?: 'letter' | 'noun-ending' | 'verb-ending'): Promise<SRSItem[]> {
  const db = await getDB();
  const now = Date.now();
  let items: SRSItem[];

  if (type) {
    items = await db.getAllFromIndex('srsItems', 'by-type', type);
  } else {
    items = await db.getAll('srsItems');
  }

  return items.filter(item => item.nextReviewDate <= now);
}

export async function saveSRSItem(item: SRSItem): Promise<void> {
  const db = await getDB();
  await db.put('srsItems', item);
}

export async function initializeSRSItems(): Promise<void> {
  const db = await getDB();
  const existingItems = await db.getAll('srsItems');

  if (existingItems.length > 0) return; // Already initialized

  const now = Date.now();

  // Initialize alphabet items
  for (const letter of greekAlphabet) {
    const item: SRSItem = {
      id: `letter-${letter.id}`,
      itemType: 'letter',
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReviewDate: now,
      lastReviewDate: 0,
      totalReviews: 0,
      correctReviews: 0,
      averageResponseTime: 0,
    };
    await db.put('srsItems', item);
  }

  // Initialize noun ending items
  for (const ending of nounEndings) {
    const item: SRSItem = {
      id: `noun-${ending.id}`,
      itemType: 'noun-ending',
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReviewDate: now,
      lastReviewDate: 0,
      totalReviews: 0,
      correctReviews: 0,
      averageResponseTime: 0,
    };
    await db.put('srsItems', item);
  }

  // Initialize verb ending items
  for (const ending of verbEndings) {
    const item: SRSItem = {
      id: `verb-${ending.id}`,
      itemType: 'verb-ending',
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReviewDate: now,
      lastReviewDate: 0,
      totalReviews: 0,
      correctReviews: 0,
      averageResponseTime: 0,
    };
    await db.put('srsItems', item);
  }
}

// Quiz history functions
export async function saveQuizResult(result: QuizResult): Promise<void> {
  const db = await getDB();
  await db.put('quizHistory', result);
}

export async function getQuizHistory(limit?: number): Promise<QuizResult[]> {
  const db = await getDB();
  const results = await db.getAllFromIndex('quizHistory', 'by-timestamp');
  results.reverse(); // Most recent first
  return limit ? results.slice(0, limit) : results;
}

export async function getQuizHistoryForItem(itemId: string): Promise<QuizResult[]> {
  const db = await getDB();
  return db.getAllFromIndex('quizHistory', 'by-item', itemId);
}

// Export/Import functions for backup
export async function exportAllData(): Promise<string> {
  const db = await getDB();
  const data = {
    settings: await db.get('settings', 'user'),
    progress: await db.get('progress', 'user'),
    srsItems: await db.getAll('srsItems'),
    quizHistory: await db.getAll('quizHistory'),
    exportedAt: Date.now(),
  };
  return JSON.stringify(data);
}

export async function importAllData(jsonString: string): Promise<void> {
  const data = JSON.parse(jsonString);
  const db = await getDB();

  if (data.settings) {
    await db.put('settings', data.settings, 'user');
  }
  if (data.progress) {
    await db.put('progress', data.progress, 'user');
  }
  if (data.srsItems) {
    for (const item of data.srsItems) {
      await db.put('srsItems', item);
    }
  }
  if (data.quizHistory) {
    for (const result of data.quizHistory) {
      await db.put('quizHistory', result);
    }
  }
}

// Reset functions
export async function resetProgress(): Promise<void> {
  const db = await getDB();

  // Clear SRS items
  const tx = db.transaction('srsItems', 'readwrite');
  await tx.store.clear();
  await tx.done;

  // Clear quiz history
  const tx2 = db.transaction('quizHistory', 'readwrite');
  await tx2.store.clear();
  await tx2.done;

  // Reset progress
  await saveProgress(defaultProgress);

  // Re-initialize SRS items
  await initializeSRSItems();
}

export async function resetSettings(): Promise<void> {
  await saveSettings(defaultSettings);
}
