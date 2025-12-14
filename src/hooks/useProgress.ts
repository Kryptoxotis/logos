import { useState, useEffect, useCallback } from 'react';
import type { UserProgress } from '../types';
import { getProgress, updateProgress, initializeSRSItems, resetProgress as resetStorageProgress } from '../lib/storage';
import { getLearningStats } from '../lib/srs';
import { nounEndings } from '../data/nounEndings';
import { verbEndings } from '../data/verbEndings';

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

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAndLoad();
  }, []);

  const initializeAndLoad = async () => {
    try {
      // Initialize SRS items if needed
      await initializeSRSItems();
      // Load progress
      await refreshProgress();
    } catch (error) {
      console.error('Failed to initialize progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProgress = useCallback(async () => {
    try {
      const stored = await getProgress();

      // Get fresh stats from SRS
      const letterStats = await getLearningStats('letter');
      const nounStats = await getLearningStats('noun-ending');
      const verbStats = await getLearningStats('verb-ending');

      // Calculate mastery percentage for alphabet
      const alphabetMasteryPercent = (letterStats.mastered / letterStats.total) * 100;
      const nounMasteryPercent = (nounStats.mastered / nounStats.total) * 100;

      // Unlock conditions
      const nounsUnlocked = alphabetMasteryPercent >= 80;
      const verbsUnlocked = nounsUnlocked && nounMasteryPercent >= 70;

      const updated: UserProgress = {
        ...stored,
        alphabet: {
          ...stored.alphabet,
          totalLetters: letterStats.total,
          masteredLetters: letterStats.mastered,
          learningLetters: letterStats.learning,
          notStartedLetters: letterStats.notStarted,
          overallAccuracy: letterStats.overallAccuracy,
        },
        parsing: {
          ...stored.parsing,
          nounsUnlocked,
          verbsUnlocked,
          nounAccuracy: nounStats.overallAccuracy,
          verbAccuracy: verbStats.overallAccuracy,
          nounsMastered: nounStats.mastered,
          verbsMastered: verbStats.mastered,
          totalNounEndings: nounStats.total,
          totalVerbEndings: verbStats.total,
        },
      };

      await updateProgress(updated);
      setProgress(updated);
      return updated;
    } catch (error) {
      console.error('Failed to refresh progress:', error);
      throw error;
    }
  }, []);

  const incrementQuizCount = useCallback(async () => {
    const updated = await updateProgress({
      totalQuizzesTaken: progress.totalQuizzesTaken + 1,
    });
    setProgress(updated);
    return updated;
  }, [progress.totalQuizzesTaken]);

  const addTimeSpent = useCallback(async (ms: number) => {
    const updated = await updateProgress({
      totalTimeSpentMs: progress.totalTimeSpentMs + ms,
    });
    setProgress(updated);
    return updated;
  }, [progress.totalTimeSpentMs]);

  const updateStreak = useCallback(async (correct: boolean) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const lastPractice = new Date(progress.alphabet.lastPracticeDate).setHours(0, 0, 0, 0);

    let newStreak = progress.alphabet.currentStreak;

    if (correct) {
      // Only increment streak if this is a new day
      if (today > lastPractice) {
        newStreak = progress.alphabet.currentStreak + 1;
      }
    } else {
      // Reset streak on wrong answer if it's the first answer of the day
      if (today > lastPractice) {
        newStreak = 0;
      }
    }

    const newBestStreak = Math.max(progress.alphabet.bestStreak, newStreak);

    const updated = await updateProgress({
      alphabet: {
        ...progress.alphabet,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        lastPracticeDate: Date.now(),
      },
    });
    setProgress(updated);
    return updated;
  }, [progress.alphabet]);

  const resetAll = useCallback(async () => {
    await resetStorageProgress();
    await initializeAndLoad();
  }, []);

  const getAlphabetMasteryPercent = useCallback(() => {
    return (progress.alphabet.masteredLetters / progress.alphabet.totalLetters) * 100;
  }, [progress.alphabet]);

  const getNounMasteryPercent = useCallback(() => {
    if (progress.parsing.totalNounEndings === 0) return 0;
    return (progress.parsing.nounsMastered / progress.parsing.totalNounEndings) * 100;
  }, [progress.parsing]);

  const getVerbMasteryPercent = useCallback(() => {
    if (progress.parsing.totalVerbEndings === 0) return 0;
    return (progress.parsing.verbsMastered / progress.parsing.totalVerbEndings) * 100;
  }, [progress.parsing]);

  return {
    progress,
    isLoading,
    refreshProgress,
    incrementQuizCount,
    addTimeSpent,
    updateStreak,
    resetAll,
    getAlphabetMasteryPercent,
    getNounMasteryPercent,
    getVerbMasteryPercent,
  };
}
