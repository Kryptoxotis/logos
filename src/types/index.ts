// Greek Alphabet Types
export interface GreekLetter {
  id: string;
  uppercase: string;
  lowercase: string;
  lowercaseFinal?: string; // For sigma (ς)
  name: string;
  sound: string;
  phoneticGuide: string;
}

// Parsing Types
export type NounCase = 'nominative' | 'genitive' | 'dative' | 'accusative' | 'vocative';
export type Gender = 'masculine' | 'feminine' | 'neuter';
export type GrammaticalNumber = 'singular' | 'plural';

export type VerbTense = 'present' | 'imperfect' | 'future' | 'aorist' | 'perfect' | 'pluperfect';
export type VerbVoice = 'active' | 'middle' | 'passive';
export type VerbMood = 'indicative' | 'subjunctive' | 'optative' | 'imperative' | 'infinitive' | 'participle';
export type VerbPerson = '1st' | '2nd' | '3rd';

export interface NounEnding {
  id: string;
  ending: string;
  case: NounCase;
  gender: Gender;
  number: GrammaticalNumber;
  declension: string;
  exampleWord?: string;
  exampleMeaning?: string;
}

export interface VerbEnding {
  id: string;
  ending: string;
  tense: VerbTense;
  voice: VerbVoice;
  mood: VerbMood;
  person: VerbPerson;
  number: GrammaticalNumber;
  exampleWord?: string;
  exampleMeaning?: string;
}

// Quiz Types
export type QuizType =
  | 'letter-to-name'      // Show Greek letter, identify English name
  | 'name-to-letter'      // Show English name, identify Greek letter
  | 'lower-to-upper'      // Show lowercase, identify uppercase
  | 'upper-to-lower'      // Show uppercase, identify lowercase
  | 'noun-parsing'        // Parse noun form
  | 'verb-parsing';       // Parse verb form

export interface QuizQuestion {
  id: string;
  type: QuizType;
  prompt: string;
  promptDisplay?: string; // For displaying Greek characters larger
  correctAnswer: string;
  options: string[];
  relatedItemId: string; // ID of the letter/ending being tested
}

export interface QuizResult {
  questionId: string;
  itemId: string;
  type: QuizType;
  correct: boolean;
  responseTimeMs: number;
  timestamp: number;
}

// SRS (Spaced Repetition System) Types - SM-2 Algorithm
export interface SRSItem {
  id: string;
  itemType: 'letter' | 'noun-ending' | 'verb-ending';
  easeFactor: number;      // Default 2.5, min 1.3
  interval: number;        // Days until next review
  repetitions: number;     // Consecutive correct answers
  nextReviewDate: number;  // Timestamp
  lastReviewDate: number;  // Timestamp
  totalReviews: number;
  correctReviews: number;
  averageResponseTime: number;
}

// User Progress Types
export interface AlphabetProgress {
  totalLetters: number;
  masteredLetters: number;  // Mastered = 80%+ accuracy with 5+ reviews
  learningLetters: number;
  notStartedLetters: number;
  overallAccuracy: number;
  currentStreak: number;
  bestStreak: number;
  lastPracticeDate: number;
}

export interface ParsingProgress {
  nounsUnlocked: boolean;
  verbsUnlocked: boolean;
  nounAccuracy: number;
  verbAccuracy: number;
  nounsMastered: number;
  verbsMastered: number;
  totalNounEndings: number;
  totalVerbEndings: number;
}

export interface UserProgress {
  alphabet: AlphabetProgress;
  parsing: ParsingProgress;
  totalQuizzesTaken: number;
  totalTimeSpentMs: number;
  createdAt: number;
  updatedAt: number;
}

// Settings Types
export interface UserSettings {
  darkMode: boolean;
  soundEnabled: boolean;
  hapticFeedback: boolean;
  showPhoneticGuide: boolean;
  quizSize: number; // Number of questions per quiz
}

// Database Schema Types
export interface DBSchema {
  settings: UserSettings;
  progress: UserProgress;
  srsItems: SRSItem[];
  quizHistory: QuizResult[];
}
