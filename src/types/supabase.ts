export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          dark_mode: boolean;
          sound_enabled: boolean;
          haptic_feedback: boolean;
          show_phonetic_guide: boolean;
          quiz_size: number;
          mastery_min_reviews: number;
          mastery_min_accuracy: number;
          mastery_min_interval: number;
          mastery_practice_weight: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          dark_mode?: boolean;
          sound_enabled?: boolean;
          haptic_feedback?: boolean;
          show_phonetic_guide?: boolean;
          quiz_size?: number;
          mastery_min_reviews?: number;
          mastery_min_accuracy?: number;
          mastery_min_interval?: number;
          mastery_practice_weight?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          dark_mode?: boolean;
          sound_enabled?: boolean;
          haptic_feedback?: boolean;
          show_phonetic_guide?: boolean;
          quiz_size?: number;
          mastery_min_reviews?: number;
          mastery_min_accuracy?: number;
          mastery_min_interval?: number;
          mastery_practice_weight?: number;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          alphabet_total: number;
          alphabet_mastered: number;
          alphabet_learning: number;
          alphabet_not_started: number;
          alphabet_accuracy: number;
          current_streak: number;
          best_streak: number;
          last_practice_date: string | null;
          nouns_unlocked: boolean;
          verbs_unlocked: boolean;
          noun_accuracy: number;
          verb_accuracy: number;
          nouns_mastered: number;
          verbs_mastered: number;
          total_quizzes: number;
          total_time_ms: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          alphabet_total?: number;
          alphabet_mastered?: number;
          alphabet_learning?: number;
          alphabet_not_started?: number;
          alphabet_accuracy?: number;
          current_streak?: number;
          best_streak?: number;
          last_practice_date?: string | null;
          nouns_unlocked?: boolean;
          verbs_unlocked?: boolean;
          noun_accuracy?: number;
          verb_accuracy?: number;
          nouns_mastered?: number;
          verbs_mastered?: number;
          total_quizzes?: number;
          total_time_ms?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          alphabet_total?: number;
          alphabet_mastered?: number;
          alphabet_learning?: number;
          alphabet_not_started?: number;
          alphabet_accuracy?: number;
          current_streak?: number;
          best_streak?: number;
          last_practice_date?: string | null;
          nouns_unlocked?: boolean;
          verbs_unlocked?: boolean;
          noun_accuracy?: number;
          verb_accuracy?: number;
          nouns_mastered?: number;
          verbs_mastered?: number;
          total_quizzes?: number;
          total_time_ms?: number;
          updated_at?: string;
        };
      };
      srs_items: {
        Row: {
          id: string;
          user_id: string;
          item_id: string;
          item_type: 'letter' | 'noun-ending' | 'verb-ending';
          ease_factor: number;
          interval: number;
          repetitions: number;
          next_review_date: string;
          last_review_date: string | null;
          total_reviews: number;
          correct_reviews: number;
          average_response_time: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_id: string;
          item_type: 'letter' | 'noun-ending' | 'verb-ending';
          ease_factor?: number;
          interval?: number;
          repetitions?: number;
          next_review_date?: string;
          last_review_date?: string | null;
          total_reviews?: number;
          correct_reviews?: number;
          average_response_time?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ease_factor?: number;
          interval?: number;
          repetitions?: number;
          next_review_date?: string;
          last_review_date?: string | null;
          total_reviews?: number;
          correct_reviews?: number;
          average_response_time?: number;
          updated_at?: string;
        };
      };
      quiz_history: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          item_id: string;
          quiz_type: string;
          correct: boolean;
          response_time_ms: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          item_id: string;
          quiz_type: string;
          correct: boolean;
          response_time_ms: number;
          created_at?: string;
        };
        Update: {
          correct?: boolean;
          response_time_ms?: number;
        };
      };
    };
  };
}
