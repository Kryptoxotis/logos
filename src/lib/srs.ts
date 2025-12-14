import type { SRSItem } from '../types';
import { getSRSItem, saveSRSItem, getDueItems, getSRSItemsByType } from './storage';

/**
 * SM-2 Algorithm Implementation for Spaced Repetition
 *
 * Quality ratings:
 * 0 - Complete blackout, no recall
 * 1 - Incorrect response, but upon seeing answer, remembered
 * 2 - Incorrect response, but answer seemed easy to recall
 * 3 - Correct response, with serious difficulty
 * 4 - Correct response, after some hesitation
 * 5 - Perfect response, instant recall
 *
 * We simplify to: 0-2 = wrong, 3-5 = correct (mapped from binary correct/incorrect + response time)
 */

const MIN_EASE_FACTOR = 1.3;
const MILLISECONDS_PER_DAY = 86400000;

// Response time thresholds (in ms)
const FAST_RESPONSE = 2000;    // Under 2 seconds = instant recall
const MEDIUM_RESPONSE = 5000;  // Under 5 seconds = good recall
const SLOW_RESPONSE = 10000;   // Under 10 seconds = hesitant

/**
 * Calculate quality rating from correct/incorrect and response time
 */
function calculateQuality(correct: boolean, responseTimeMs: number): number {
  if (!correct) {
    // Wrong answers
    if (responseTimeMs < MEDIUM_RESPONSE) {
      return 2; // Quick but wrong - maybe knew it
    } else if (responseTimeMs < SLOW_RESPONSE) {
      return 1; // Slow and wrong - partial recall
    }
    return 0; // Very slow and wrong - complete blackout
  }

  // Correct answers
  if (responseTimeMs < FAST_RESPONSE) {
    return 5; // Perfect, instant recall
  } else if (responseTimeMs < MEDIUM_RESPONSE) {
    return 4; // Good, after some thought
  } else if (responseTimeMs < SLOW_RESPONSE) {
    return 3; // Correct but difficult
  }
  return 3; // Very slow but still correct
}

/**
 * Update an SRS item based on review performance
 */
export async function processReview(
  itemId: string,
  correct: boolean,
  responseTimeMs: number
): Promise<SRSItem | null> {
  const item = await getSRSItem(itemId);
  if (!item) return null;

  const quality = calculateQuality(correct, responseTimeMs);
  const now = Date.now();

  // Update statistics
  item.totalReviews++;
  if (correct) {
    item.correctReviews++;
  }
  item.averageResponseTime =
    (item.averageResponseTime * (item.totalReviews - 1) + responseTimeMs) / item.totalReviews;
  item.lastReviewDate = now;

  if (quality >= 3) {
    // Correct response
    if (item.repetitions === 0) {
      item.interval = 1; // First correct: review in 1 day
    } else if (item.repetitions === 1) {
      item.interval = 6; // Second correct: review in 6 days
    } else {
      item.interval = Math.round(item.interval * item.easeFactor);
    }
    item.repetitions++;
  } else {
    // Incorrect response - reset
    item.repetitions = 0;
    item.interval = 0; // Review again soon (will be available immediately)
  }

  // Update ease factor (but never below minimum)
  const newEaseFactor = item.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  item.easeFactor = Math.max(MIN_EASE_FACTOR, newEaseFactor);

  // Calculate next review date
  item.nextReviewDate = now + (item.interval * MILLISECONDS_PER_DAY);

  await saveSRSItem(item);
  return item;
}

/**
 * Get items that are due for review
 */
export async function getReviewQueue(
  type?: 'letter' | 'noun-ending' | 'verb-ending',
  limit?: number
): Promise<SRSItem[]> {
  const dueItems = await getDueItems(type);

  // Sort by: items with more failures first, then by next review date
  dueItems.sort((a, b) => {
    // Prioritize items that have been failed (lower repetitions)
    if (a.repetitions !== b.repetitions) {
      return a.repetitions - b.repetitions;
    }
    // Then by due date (oldest first)
    return a.nextReviewDate - b.nextReviewDate;
  });

  return limit ? dueItems.slice(0, limit) : dueItems;
}

/**
 * Get items that haven't been reviewed yet (new items)
 */
export async function getNewItems(
  type?: 'letter' | 'noun-ending' | 'verb-ending',
  limit?: number
): Promise<SRSItem[]> {
  let items: SRSItem[];

  if (type) {
    items = await getSRSItemsByType(type);
  } else {
    items = await getDueItems();
  }

  const newItems = items.filter(item => item.totalReviews === 0);

  return limit ? newItems.slice(0, limit) : newItems;
}

/**
 * Calculate mastery percentage for a set of items
 * An item is "mastered" if:
 * - Has at least 5 reviews
 * - Has 80%+ accuracy
 * - Current interval is at least 7 days
 */
export function isMastered(item: SRSItem): boolean {
  if (item.totalReviews < 5) return false;
  const accuracy = item.correctReviews / item.totalReviews;
  if (accuracy < 0.8) return false;
  if (item.interval < 7) return false;
  return true;
}

/**
 * Calculate if an item is "learning" (started but not mastered)
 */
export function isLearning(item: SRSItem): boolean {
  return item.totalReviews > 0 && !isMastered(item);
}

/**
 * Get learning statistics for a type of item
 */
export async function getLearningStats(type: 'letter' | 'noun-ending' | 'verb-ending'): Promise<{
  total: number;
  mastered: number;
  learning: number;
  notStarted: number;
  overallAccuracy: number;
  dueNow: number;
}> {
  const items = await getSRSItemsByType(type);
  const now = Date.now();

  let mastered = 0;
  let learning = 0;
  let notStarted = 0;
  let totalReviews = 0;
  let correctReviews = 0;
  let dueNow = 0;

  for (const item of items) {
    if (item.totalReviews === 0) {
      notStarted++;
    } else if (isMastered(item)) {
      mastered++;
    } else {
      learning++;
    }

    totalReviews += item.totalReviews;
    correctReviews += item.correctReviews;

    if (item.nextReviewDate <= now) {
      dueNow++;
    }
  }

  return {
    total: items.length,
    mastered,
    learning,
    notStarted,
    overallAccuracy: totalReviews > 0 ? (correctReviews / totalReviews) * 100 : 0,
    dueNow,
  };
}

/**
 * Get a mixed review queue (due items + some new items)
 */
export async function getMixedQueue(
  type?: 'letter' | 'noun-ending' | 'verb-ending',
  totalSize: number = 10,
  newItemRatio: number = 0.3
): Promise<SRSItem[]> {
  const dueItems = await getReviewQueue(type);
  const newItems = await getNewItems(type);

  const maxNewItems = Math.floor(totalSize * newItemRatio);
  const newItemsToInclude = newItems.slice(0, Math.min(maxNewItems, newItems.length));

  const dueToInclude = dueItems.slice(0, totalSize - newItemsToInclude.length);

  // Shuffle the combined list
  const combined = [...dueToInclude, ...newItemsToInclude];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined;
}
