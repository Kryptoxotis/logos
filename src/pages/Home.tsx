import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Card, CircularProgress, ProgressBar } from '../components/ui';
import { useProgress } from '../hooks/useProgress';
import styles from './Home.module.css';

export function Home() {
  const navigate = useNavigate();
  const { progress, isLoading, refreshProgress, getAlphabetMasteryPercent } = useProgress();

  useEffect(() => {
    refreshProgress();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading...</p>
      </div>
    );
  }

  const alphabetPercent = getAlphabetMasteryPercent();
  const canAccessParsing = progress.parsing.nounsUnlocked;

  return (
    <div className={styles.container}>
      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className={styles.title}>Krypto Greek</h1>
        <p className={styles.tagline}>Unlock the original text</p>
      </motion.header>

      <motion.div
        className={styles.progressSection}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card variant="elevated" padding="lg">
          <div className={styles.progressContent}>
            <CircularProgress
              value={alphabetPercent}
              size={100}
              strokeWidth={10}
              variant="accent"
            />
            <div className={styles.progressInfo}>
              <h3>Alphabet Progress</h3>
              <p className={styles.progressDetail}>
                {progress.alphabet.masteredLetters} of {progress.alphabet.totalLetters} letters mastered
              </p>
              {progress.alphabet.currentStreak > 0 && (
                <p className={styles.streak}>
                  🔥 {progress.alphabet.currentStreak} day streak
                </p>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.section
        className={styles.modules}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h2 className={styles.sectionTitle}>Learning Modules</h2>

        <div className={styles.moduleGrid}>
          <Card
            variant="default"
            padding="md"
            clickable
            onClick={() => navigate('/alphabet')}
            className={styles.moduleCard}
          >
            <div className={styles.moduleIcon}>Αα</div>
            <h3 className={styles.moduleTitle}>Greek Alphabet</h3>
            <p className={styles.moduleDesc}>Learn all 24 letters</p>
            <ProgressBar value={alphabetPercent} size="sm" variant="accent" />
            <span className={styles.moduleStatus}>
              {progress.alphabet.learningLetters > 0
                ? `${progress.alphabet.learningLetters} in progress`
                : alphabetPercent === 100
                ? 'Complete!'
                : 'Start learning'}
            </span>
          </Card>

          <Card
            variant={canAccessParsing ? 'default' : 'outlined'}
            padding="md"
            clickable={canAccessParsing}
            onClick={() => canAccessParsing && navigate('/parsing')}
            className={`${styles.moduleCard} ${!canAccessParsing ? styles.locked : ''}`}
          >
            <div className={styles.moduleIcon}>
              {canAccessParsing ? 'λύω' : '🔒'}
            </div>
            <h3 className={styles.moduleTitle}>Parsing Practice</h3>
            <p className={styles.moduleDesc}>
              {canAccessParsing
                ? 'Nouns & Verbs'
                : 'Master 80% of alphabet to unlock'}
            </p>
            {canAccessParsing && (
              <>
                <ProgressBar
                  value={(progress.parsing.nounsMastered / progress.parsing.totalNounEndings) * 100}
                  size="sm"
                  variant="success"
                />
                <span className={styles.moduleStatus}>
                  {progress.parsing.nounsMastered} nouns mastered
                </span>
              </>
            )}
            {!canAccessParsing && (
              <div className={styles.lockProgress}>
                <ProgressBar value={alphabetPercent} max={80} size="sm" />
                <span>{Math.round(alphabetPercent)}/80%</span>
              </div>
            )}
          </Card>
        </div>
      </motion.section>

      <motion.section
        className={styles.quickStart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate('/alphabet/quiz')}
        >
          Start Practice Session
        </Button>
      </motion.section>

      <motion.section
        className={styles.stats}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div className={styles.statGrid}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{progress.totalQuizzesTaken}</span>
            <span className={styles.statLabel}>Quizzes</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {Math.round(progress.alphabet.overallAccuracy)}%
            </span>
            <span className={styles.statLabel}>Accuracy</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{progress.alphabet.bestStreak}</span>
            <span className={styles.statLabel}>Best Streak</span>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
