import { supabase } from './supabase';
import type { SRSItem, UserProgress, UserSettings, QuizResult } from '../types';
import { greekAlphabet } from '../data/alphabet';
import { nounEndings } from '../data/nounEndings';
import { verbEndings } from '../data/verbEndings';

// Default settings
export const defaultSettings: UserSettings = {
  darkMode: true,
  soundEnabled: true,
  hapticFeedback: true,
  showPhoneticGuide: true,
  quizSize: 10,
  mastery: {
    minReviews: 5,
    minAccuracy: 80,
    minInterval: 7,
    practiceWeight: 0.5,
  },
};

// Default progress
export const defaultProgress: UserProgress = {
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

// Helper to get current user ID
async function getUserId(): Promise<string | null> {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

// Settings functions
export async function getSettingsFromSupabase(): Promise<UserSettings | null> {
  const userId = await getUserId();
  if (!userId || !supabase) return null;

  const { data, error } = await (supabase
    .from('user_settings') as any)
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  const row = data as any;
  return {
    darkMode: row.dark_mode,
    soundEnabled: row.sound_enabled,
    hapticFeedback: row.haptic_feedback,
    showPhoneticGuide: row.show_phonetic_guide,
    quizSize: row.quiz_size,
    mastery: {
      minReviews: row.mastery_min_reviews,
      minAccuracy: row.mastery_min_accuracy,
      minInterval: row.mastery_min_interval,
      practiceWeight: Number(row.mastery_practice_weight),
    },
  };
}

export async function saveSettingsToSupabase(settings: UserSettings): Promise<boolean> {
  const userId = await getUserId();
  if (!userId || !supabase) return false;

  const { error } = await (supabase
    .from('user_settings') as any)
    .upsert({
      user_id: userId,
      dark_mode: settings.darkMode,
      sound_enabled: settings.soundEnabled,
      haptic_feedback: settings.hapticFeedback,
      show_phonetic_guide: settings.showPhoneticGuide,
      quiz_size: settings.quizSize,
      mastery_min_reviews: settings.mastery?.minReviews ?? 5,
      mastery_min_accuracy: settings.mastery?.minAccuracy ?? 80,
      mastery_min_interval: settings.mastery?.minInterval ?? 7,
      mastery_practice_weight: settings.mastery?.practiceWeight ?? 0.5,
    }, { onConflict: 'user_id' });

  return !error;
}

// Progress functions
export async function getProgressFromSupabase(): Promise<UserProgress | null> {
  const userId = await getUserId();
  if (!userId || !supabase) return null;

  const { data, error } = await (supabase
    .from('user_progress') as any)
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  const row = data as any;
  return {
    alphabet: {
      totalLetters: row.alphabet_total,
      masteredLetters: row.alphabet_mastered,
      learningLetters: row.alphabet_learning,
      notStartedLetters: row.alphabet_not_started,
      overallAccuracy: Number(row.alphabet_accuracy),
      currentStreak: row.current_streak,
      bestStreak: row.best_streak,
      lastPracticeDate: row.last_practice_date ? new Date(row.last_practice_date).getTime() : 0,
    },
    parsing: {
      nounsUnlocked: row.nouns_unlocked,
      verbsUnlocked: row.verbs_unlocked,
      nounAccuracy: Number(row.noun_accuracy),
      verbAccuracy: Number(row.verb_accuracy),
      nounsMastered: row.nouns_mastered,
      verbsMastered: row.verbs_mastered,
      totalNounEndings: nounEndings.length,
      totalVerbEndings: verbEndings.length,
    },
    totalQuizzesTaken: row.total_quizzes,
    totalTimeSpentMs: Number(row.total_time_ms),
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  };
}

export async function saveProgressToSupabase(progress: UserProgress): Promise<boolean> {
  const userId = await getUserId();
  if (!userId || !supabase) return false;

  const { error } = await (supabase
    .from('user_progress') as any)
    .upsert({
      user_id: userId,
      alphabet_total: progress.alphabet.totalLetters,
      alphabet_mastered: progress.alphabet.masteredLetters,
      alphabet_learning: progress.alphabet.learningLetters,
      alphabet_not_started: progress.alphabet.notStartedLetters,
      alphabet_accuracy: progress.alphabet.overallAccuracy,
      current_streak: progress.alphabet.currentStreak,
      best_streak: progress.alphabet.bestStreak,
      last_practice_date: progress.alphabet.lastPracticeDate ? new Date(progress.alphabet.lastPracticeDate).toISOString() : null,
      nouns_unlocked: progress.parsing.nounsUnlocked,
      verbs_unlocked: progress.parsing.verbsUnlocked,
      noun_accuracy: progress.parsing.nounAccuracy,
      verb_accuracy: progress.parsing.verbAccuracy,
      nouns_mastered: progress.parsing.nounsMastered,
      verbs_mastered: progress.parsing.verbsMastered,
      total_quizzes: progress.totalQuizzesTaken,
      total_time_ms: progress.totalTimeSpentMs,
    }, { onConflict: 'user_id' });

  return !error;
}

// SRS Item functions
export async function getSRSItemFromSupabase(itemId: string): Promise<SRSItem | null> {
  const userId = await getUserId();
  if (!userId || !supabase) return null;

  const { data, error } = await (supabase
    .from('srs_items') as any)
    .select('*')
    .eq('user_id', userId)
    .eq('item_id', itemId)
    .single();

  if (error || !data) return null;

  return mapSRSItemFromDB(data);
}

export async function getAllSRSItemsFromSupabase(): Promise<SRSItem[]> {
  const userId = await getUserId();
  if (!userId || !supabase) return [];

  const { data, error } = await (supabase
    .from('srs_items') as any)
    .select('*')
    .eq('user_id', userId);

  if (error || !data) return [];

  return (data as any[]).map(mapSRSItemFromDB);
}

export async function getSRSItemsByTypeFromSupabase(type: 'letter' | 'noun-ending' | 'verb-ending'): Promise<SRSItem[]> {
  const userId = await getUserId();
  if (!userId || !supabase) return [];

  const { data, error } = await (supabase
    .from('srs_items') as any)
    .select('*')
    .eq('user_id', userId)
    .eq('item_type', type);

  if (error || !data) return [];

  return (data as any[]).map(mapSRSItemFromDB);
}

export async function getDueItemsFromSupabase(type?: 'letter' | 'noun-ending' | 'verb-ending'): Promise<SRSItem[]> {
  const userId = await getUserId();
  if (!userId || !supabase) return [];

  let query = (supabase
    .from('srs_items') as any)
    .select('*')
    .eq('user_id', userId)
    .lte('next_review_date', new Date().toISOString());

  if (type) {
    query = query.eq('item_type', type);
  }

  const { data, error } = await query;

  if (error || !data) return [];

  return (data as any[]).map(mapSRSItemFromDB);
}

export async function saveSRSItemToSupabase(item: SRSItem): Promise<boolean> {
  const userId = await getUserId();
  if (!userId || !supabase) return false;

  const { error } = await (supabase
    .from('srs_items') as any)
    .upsert({
      user_id: userId,
      item_id: item.id,
      item_type: item.itemType,
      ease_factor: item.easeFactor,
      interval: item.interval,
      repetitions: item.repetitions,
      next_review_date: new Date(item.nextReviewDate).toISOString(),
      last_review_date: item.lastReviewDate ? new Date(item.lastReviewDate).toISOString() : null,
      total_reviews: item.totalReviews,
      correct_reviews: item.correctReviews,
      average_response_time: item.averageResponseTime,
    }, { onConflict: 'user_id,item_id' });

  return !error;
}

export async function initializeSRSItemsInSupabase(): Promise<boolean> {
  const userId = await getUserId();
  if (!userId || !supabase) return false;

  // Check if already initialized
  const { data: existing } = await (supabase
    .from('srs_items') as any)
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  if (existing && existing.length > 0) return true; // Already initialized

  const now = new Date().toISOString();
  const items: any[] = [];

  // Initialize alphabet items
  for (const letter of greekAlphabet) {
    items.push({
      user_id: userId,
      item_id: `letter-${letter.id}`,
      item_type: 'letter',
      ease_factor: 2.5,
      interval: 0,
      repetitions: 0,
      next_review_date: now,
      last_review_date: null,
      total_reviews: 0,
      correct_reviews: 0,
      average_response_time: 0,
    });
  }

  // Initialize noun ending items
  for (const ending of nounEndings) {
    items.push({
      user_id: userId,
      item_id: `noun-${ending.id}`,
      item_type: 'noun-ending',
      ease_factor: 2.5,
      interval: 0,
      repetitions: 0,
      next_review_date: now,
      last_review_date: null,
      total_reviews: 0,
      correct_reviews: 0,
      average_response_time: 0,
    });
  }

  // Initialize verb ending items
  for (const ending of verbEndings) {
    items.push({
      user_id: userId,
      item_id: `verb-${ending.id}`,
      item_type: 'verb-ending',
      ease_factor: 2.5,
      interval: 0,
      repetitions: 0,
      next_review_date: now,
      last_review_date: null,
      total_reviews: 0,
      correct_reviews: 0,
      average_response_time: 0,
    });
  }

  const { error } = await (supabase.from('srs_items') as any).insert(items);
  return !error;
}

// Quiz history functions
export async function saveQuizResultToSupabase(result: QuizResult): Promise<boolean> {
  const userId = await getUserId();
  if (!userId || !supabase) return false;

  const { error } = await (supabase
    .from('quiz_history') as any)
    .insert({
      user_id: userId,
      question_id: result.questionId,
      item_id: result.itemId,
      quiz_type: result.type,
      correct: result.correct,
      response_time_ms: result.responseTimeMs,
    });

  return !error;
}

export async function getQuizHistoryFromSupabase(limit?: number): Promise<QuizResult[]> {
  const userId = await getUserId();
  if (!userId || !supabase) return [];

  let query = (supabase
    .from('quiz_history') as any)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data) return [];

  return (data as any[]).map(mapQuizResultFromDB);
}

// Reset functions
export async function resetProgressInSupabase(): Promise<boolean> {
  const userId = await getUserId();
  if (!userId || !supabase) return false;

  // Delete SRS items
  await (supabase.from('srs_items') as any).delete().eq('user_id', userId);

  // Delete quiz history
  await (supabase.from('quiz_history') as any).delete().eq('user_id', userId);

  // Reset progress to defaults
  await saveProgressToSupabase(defaultProgress);

  // Re-initialize SRS items
  await initializeSRSItemsInSupabase();

  return true;
}

// Helper functions
function mapSRSItemFromDB(data: any): SRSItem {
  return {
    id: data.item_id,
    itemType: data.item_type,
    easeFactor: Number(data.ease_factor),
    interval: data.interval,
    repetitions: data.repetitions,
    nextReviewDate: new Date(data.next_review_date).getTime(),
    lastReviewDate: data.last_review_date ? new Date(data.last_review_date).getTime() : 0,
    totalReviews: data.total_reviews,
    correctReviews: data.correct_reviews,
    averageResponseTime: data.average_response_time,
  };
}

function mapQuizResultFromDB(data: any): QuizResult {
  return {
    questionId: data.question_id,
    itemId: data.item_id,
    type: data.quiz_type,
    correct: data.correct,
    responseTimeMs: data.response_time_ms,
    timestamp: new Date(data.created_at).getTime(),
  };
}
