import { useState, useCallback, useRef } from 'react';
import type { QuizQuestion, QuizResult } from '../types';
import { generateQuiz } from '../lib/quiz';
import { processReview, getMixedQueue } from '../lib/srs';
import { saveQuizResult } from '../lib/storage';

interface QuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Map<string, { answer: string; correct: boolean; timeMs: number }>;
  isComplete: boolean;
  isLoading: boolean;
}

export function useQuiz(itemType: 'letter' | 'noun-ending' | 'verb-ending') {
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    answers: new Map(),
    isComplete: false,
    isLoading: false,
  });

  const questionStartTime = useRef<number>(0);
  const quizStartTime = useRef<number>(0);

  const startQuiz = useCallback(async (quizSize: number = 10) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Get items from SRS queue
      const srsItems = await getMixedQueue(itemType, quizSize, 0.3);

      if (srsItems.length === 0) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          questions: [],
          isComplete: true,
        }));
        return;
      }

      // Generate questions
      const questions = generateQuiz(srsItems);

      setState({
        questions,
        currentIndex: 0,
        answers: new Map(),
        isComplete: false,
        isLoading: false,
      });

      questionStartTime.current = Date.now();
      quizStartTime.current = Date.now();
    } catch (error) {
      console.error('Failed to start quiz:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [itemType]);

  const submitAnswer = useCallback(async (answer: string): Promise<boolean> => {
    const currentQuestion = state.questions[state.currentIndex];
    if (!currentQuestion) return false;

    const responseTimeMs = Date.now() - questionStartTime.current;
    const isCorrect = answer === currentQuestion.correctAnswer;

    // Update SRS
    await processReview(currentQuestion.relatedItemId, isCorrect, responseTimeMs);

    // Save result
    const result: QuizResult = {
      questionId: currentQuestion.id,
      itemId: currentQuestion.relatedItemId,
      type: currentQuestion.type,
      correct: isCorrect,
      responseTimeMs,
      timestamp: Date.now(),
    };
    await saveQuizResult(result);

    // Update state
    const newAnswers = new Map(state.answers);
    newAnswers.set(currentQuestion.id, {
      answer,
      correct: isCorrect,
      timeMs: responseTimeMs,
    });

    setState(prev => ({
      ...prev,
      answers: newAnswers,
    }));

    return isCorrect;
  }, [state.questions, state.currentIndex, state.answers]);

  const nextQuestion = useCallback(() => {
    const nextIndex = state.currentIndex + 1;
    const isComplete = nextIndex >= state.questions.length;

    setState(prev => ({
      ...prev,
      currentIndex: nextIndex,
      isComplete,
    }));

    if (!isComplete) {
      questionStartTime.current = Date.now();
    }
  }, [state.currentIndex, state.questions.length]);

  const getCurrentQuestion = useCallback((): QuizQuestion | null => {
    return state.questions[state.currentIndex] || null;
  }, [state.questions, state.currentIndex]);

  const getResults = useCallback(() => {
    const totalQuestions = state.questions.length;
    const correctAnswers = Array.from(state.answers.values()).filter(a => a.correct).length;
    const totalTimeMs = Date.now() - quizStartTime.current;
    const averageTimeMs =
      state.answers.size > 0
        ? Array.from(state.answers.values()).reduce((sum, a) => sum + a.timeMs, 0) /
          state.answers.size
        : 0;

    return {
      totalQuestions,
      correctAnswers,
      accuracy: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
      totalTimeMs,
      averageTimeMs,
    };
  }, [state.questions.length, state.answers]);

  const resetQuiz = useCallback(() => {
    setState({
      questions: [],
      currentIndex: 0,
      answers: new Map(),
      isComplete: false,
      isLoading: false,
    });
  }, []);

  return {
    questions: state.questions,
    currentIndex: state.currentIndex,
    currentQuestion: getCurrentQuestion(),
    isComplete: state.isComplete,
    isLoading: state.isLoading,
    answers: state.answers,
    startQuiz,
    submitAnswer,
    nextQuestion,
    getResults,
    resetQuiz,
    progress: {
      current: state.currentIndex + 1,
      total: state.questions.length,
      percent: state.questions.length > 0
        ? ((state.currentIndex) / state.questions.length) * 100
        : 0,
    },
  };
}
