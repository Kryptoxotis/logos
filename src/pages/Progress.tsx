import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, ProgressBar, CircularProgress } from '../components/ui';
import { useProgress } from '../hooks/useProgress';
import { getLearningStats } from '../lib/srs';
import { getQuizHistory } from '../lib/storage';
import type { QuizResult } from '../types';
import styles from './Progress.module.css';

interface DetailedStats {
  letter: Awaited<ReturnType<typeof getLearningStats>>;
  noun: Awaited<ReturnType<typeof getLearningStats>>;
  verb: Awaited<ReturnType<typeof getLearningStats>>;
}

export function Progress() {
  const { progress, isLoading, getAlphabetMasteryPercent } = useProgress();
  const [stats, setStats] = useState<DetailedStats | null>(null);
  const [recentHistory, setRecentHistory] = useState<QuizResult[]>([]);

  useEffect(() => {
    loadDetailedStats();
    loadHistory();
  }, []);

  const loadDetailedStats = async () => {
    const [letter, noun, verb] = await Promise.all([
      getLearningStats('letter'),
      getLearningStats('noun-ending'),
      getLearningStats('verb-ending'),
    ]);
    setStats({ letter, noun, verb });
  };

  const loadHistory = async () => {
    const history = await getQuizHistory(20);
    setRecentHistory(history);
  };

  const formatTime = (ms: number): string => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading || !stats) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  const alphabetPercent = getAlphabetMasteryPercent();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Your Progress</h1>
      </header>

      {/* Overall Stats */}
      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card variant="elevated" padding="lg">
          <div className={styles.overallStats}>
            <CircularProgress
              value={alphabetPercent}
              size={90}
              strokeWidth={8}
              variant="accent"
            />
            <div className={styles.overallInfo}>
              <h2>Overall Mastery</h2>
              <div className={styles.streakInfo}>
                <span className={styles.streakCurrent}>
                  🔥 {progress.alphabet.currentStreak} day streak
                </span>
                <span className={styles.streakBest}>
                  Best: {progress.alphabet.bestStreak} days
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Quick Stats */}
      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className={styles.quickStats}>
          <Card variant="default" padding="md" className={styles.quickStat}>
            <span className={styles.quickValue}>{progress.totalQuizzesTaken}</span>
            <span className={styles.quickLabel}>Quizzes</span>
          </Card>
          <Card variant="default" padding="md" className={styles.quickStat}>
            <span className={styles.quickValue}>
              {Math.round(progress.alphabet.overallAccuracy)}%
            </span>
            <span className={styles.quickLabel}>Accuracy</span>
          </Card>
          <Card variant="default" padding="md" className={styles.quickStat}>
            <span className={styles.quickValue}>
              {formatTime(progress.totalTimeSpentMs)}
            </span>
            <span className={styles.quickLabel}>Time</span>
          </Card>
        </div>
      </motion.section>

      {/* Module Progress */}
      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h2 className={styles.sectionTitle}>Module Progress</h2>

        <Card variant="default" padding="none">
          {/* Alphabet */}
          <div className={styles.moduleItem}>
            <div className={styles.moduleHeader}>
              <span className={styles.moduleIcon}>Αα</span>
              <span className={styles.moduleName}>Greek Alphabet</span>
              <span className={styles.modulePercent}>
                {Math.round(alphabetPercent)}%
              </span>
            </div>
            <ProgressBar value={alphabetPercent} size="sm" variant="accent" />
            <div className={styles.moduleDetails}>
              <span>{stats.letter.mastered} mastered</span>
              <span>{stats.letter.learning} learning</span>
              <span>{stats.letter.dueNow} due</span>
            </div>
          </div>

          {/* Nouns */}
          <div className={styles.moduleItem}>
            <div className={styles.moduleHeader}>
              <span className={styles.moduleIcon}>λόγος</span>
              <span className={styles.moduleName}>Noun Parsing</span>
              <span className={styles.modulePercent}>
                {progress.parsing.nounsUnlocked
                  ? `${Math.round((stats.noun.mastered / stats.noun.total) * 100)}%`
                  : '🔒'}
              </span>
            </div>
            {progress.parsing.nounsUnlocked && (
              <>
                <ProgressBar
                  value={(stats.noun.mastered / stats.noun.total) * 100}
                  size="sm"
                  variant="success"
                />
                <div className={styles.moduleDetails}>
                  <span>{stats.noun.mastered} mastered</span>
                  <span>{stats.noun.learning} learning</span>
                  <span>{stats.noun.dueNow} due</span>
                </div>
              </>
            )}
          </div>

          {/* Verbs */}
          <div className={styles.moduleItem}>
            <div className={styles.moduleHeader}>
              <span className={styles.moduleIcon}>λύω</span>
              <span className={styles.moduleName}>Verb Parsing</span>
              <span className={styles.modulePercent}>
                {progress.parsing.verbsUnlocked
                  ? `${Math.round((stats.verb.mastered / stats.verb.total) * 100)}%`
                  : '🔒'}
              </span>
            </div>
            {progress.parsing.verbsUnlocked && (
              <>
                <ProgressBar
                  value={(stats.verb.mastered / stats.verb.total) * 100}
                  size="sm"
                  variant="accent"
                />
                <div className={styles.moduleDetails}>
                  <span>{stats.verb.mastered} mastered</span>
                  <span>{stats.verb.learning} learning</span>
                  <span>{stats.verb.dueNow} due</span>
                </div>
              </>
            )}
          </div>
        </Card>
      </motion.section>

      {/* Recent Activity */}
      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h2 className={styles.sectionTitle}>Recent Activity</h2>

        {recentHistory.length > 0 ? (
          <Card variant="default" padding="none">
            <div className={styles.activityList}>
              {recentHistory.slice(0, 10).map((result) => (
                <div key={result.questionId} className={styles.activityItem}>
                  <span
                    className={`${styles.activityIcon} ${
                      result.correct ? styles.correct : styles.incorrect
                    }`}
                  >
                    {result.correct ? '✓' : '✗'}
                  </span>
                  <span className={styles.activityType}>
                    {result.type.replace('-', ' ')}
                  </span>
                  <span className={styles.activityTime}>
                    {(result.responseTimeMs / 1000).toFixed(1)}s
                  </span>
                  <span className={styles.activityDate}>
                    {formatDate(result.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card variant="default" padding="lg" className={styles.emptyState}>
            <p>No quiz history yet. Start practicing to see your activity!</p>
          </Card>
        )}
      </motion.section>

      {/* Items Due */}
      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <h2 className={styles.sectionTitle}>Items Due for Review</h2>
        <Card variant="default" padding="md">
          <div className={styles.dueItems}>
            <div className={styles.dueItem}>
              <span className={styles.dueCount}>{stats.letter.dueNow}</span>
              <span className={styles.dueLabel}>Letters</span>
            </div>
            <div className={styles.dueItem}>
              <span className={styles.dueCount}>{stats.noun.dueNow}</span>
              <span className={styles.dueLabel}>Nouns</span>
            </div>
            <div className={styles.dueItem}>
              <span className={styles.dueCount}>{stats.verb.dueNow}</span>
              <span className={styles.dueLabel}>Verbs</span>
            </div>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}
