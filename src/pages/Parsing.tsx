import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, ProgressBar, OptionButton } from '../components/ui';
import { useProgress } from '../hooks/useProgress';
import { useQuiz } from '../hooks/useQuiz';
import { useSettings } from '../hooks/useSettings';
import { getNounEndingById } from '../data/nounEndings';
import { getVerbEndingById } from '../data/verbEndings';
import styles from './Parsing.module.css';

type ParsingMode = 'select' | 'noun-quiz' | 'verb-quiz' | 'results';

export function Parsing() {
  const navigate = useNavigate();
  const { progress, refreshProgress, incrementQuizCount } = useProgress();
  const { settings } = useSettings();
  const [mode, setMode] = useState<ParsingMode>('select');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const nounQuiz = useQuiz('noun-ending');
  const verbQuiz = useQuiz('verb-ending');

  const activeQuiz = mode === 'noun-quiz' ? nounQuiz : verbQuiz;

  const handleStartNounQuiz = async () => {
    await nounQuiz.startQuiz(settings.quizSize);
    setMode('noun-quiz');
  };

  const handleStartVerbQuiz = async () => {
    await verbQuiz.startQuiz(settings.quizSize);
    setMode('verb-quiz');
  };

  const handleAnswerSelect = async (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = await activeQuiz.submitAnswer(answer);
    setIsCorrect(correct);

    setTimeout(() => {
      if (activeQuiz.currentIndex + 1 >= activeQuiz.questions.length) {
        handleQuizComplete();
      } else {
        activeQuiz.nextQuestion();
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }, correct ? 1000 : 1500);
  };

  const handleQuizComplete = async () => {
    await incrementQuizCount();
    await refreshProgress();
    setMode('results');
  };

  const handleBackToSelect = () => {
    nounQuiz.resetQuiz();
    verbQuiz.resetQuiz();
    setSelectedAnswer(null);
    setIsCorrect(null);
    setMode('select');
  };

  const getOptionState = (option: string) => {
    if (selectedAnswer === null) return 'default';
    if (option === activeQuiz.currentQuestion?.correctAnswer) return 'correct';
    if (option === selectedAnswer && !isCorrect) return 'incorrect';
    return 'disabled';
  };

  // Not unlocked yet
  if (!progress.parsing.nounsUnlocked) {
    return (
      <div className={styles.container}>
        <motion.div
          className={styles.locked}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.lockIcon}>🔒</div>
          <h1>Parsing Locked</h1>
          <p>Master 80% of the Greek alphabet to unlock parsing practice.</p>
          <div className={styles.unlockProgress}>
            <ProgressBar
              value={progress.alphabet.masteredLetters}
              max={Math.ceil(progress.alphabet.totalLetters * 0.8)}
              showLabel
              variant="accent"
            />
            <span className={styles.unlockText}>
              {progress.alphabet.masteredLetters} / {Math.ceil(progress.alphabet.totalLetters * 0.8)} letters needed
            </span>
          </div>
          <Button variant="primary" onClick={() => navigate('/alphabet')}>
            Practice Alphabet
          </Button>
        </motion.div>
      </div>
    );
  }

  // Selection screen
  if (mode === 'select') {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Parsing Practice</h1>
          <p>Learn to identify Greek noun and verb forms</p>
        </header>

        <div className={styles.moduleCards}>
          <Card
            variant="elevated"
            padding="lg"
            clickable
            onClick={handleStartNounQuiz}
            className={styles.moduleCard}
          >
            <div className={styles.moduleIcon}>λόγος</div>
            <h2>Noun Parsing</h2>
            <p>Case, Gender, Number</p>
            <ProgressBar
              value={progress.parsing.nounsMastered}
              max={progress.parsing.totalNounEndings}
              size="sm"
              variant="success"
            />
            <span className={styles.moduleStats}>
              {progress.parsing.nounsMastered} / {progress.parsing.totalNounEndings} mastered
            </span>
          </Card>

          <Card
            variant={progress.parsing.verbsUnlocked ? 'elevated' : 'outlined'}
            padding="lg"
            clickable={progress.parsing.verbsUnlocked}
            onClick={progress.parsing.verbsUnlocked ? handleStartVerbQuiz : undefined}
            className={`${styles.moduleCard} ${!progress.parsing.verbsUnlocked ? styles.locked : ''}`}
          >
            <div className={styles.moduleIcon}>
              {progress.parsing.verbsUnlocked ? 'λύω' : '🔒'}
            </div>
            <h2>Verb Parsing</h2>
            <p>
              {progress.parsing.verbsUnlocked
                ? 'Tense, Voice, Mood, Person, Number'
                : 'Master 70% of nouns to unlock'}
            </p>
            {progress.parsing.verbsUnlocked ? (
              <>
                <ProgressBar
                  value={progress.parsing.verbsMastered}
                  max={progress.parsing.totalVerbEndings}
                  size="sm"
                  variant="accent"
                />
                <span className={styles.moduleStats}>
                  {progress.parsing.verbsMastered} / {progress.parsing.totalVerbEndings} mastered
                </span>
              </>
            ) : (
              <div className={styles.lockProgress}>
                <ProgressBar
                  value={progress.parsing.nounsMastered}
                  max={Math.ceil(progress.parsing.totalNounEndings * 0.7)}
                  size="sm"
                />
                <span>
                  {progress.parsing.nounsMastered} / {Math.ceil(progress.parsing.totalNounEndings * 0.7)} nouns needed
                </span>
              </div>
            )}
          </Card>
        </div>

        <div className={styles.info}>
          <Card variant="default" padding="md">
            <h3>Quick Reference</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Cases:</span>
                <span>Nom, Gen, Dat, Acc, Voc</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Genders:</span>
                <span>Masc, Fem, Neut</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Numbers:</span>
                <span>Singular, Plural</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Results screen
  if (mode === 'results') {
    const results = activeQuiz.getResults();
    const isPerfect = results.accuracy === 100;
    const isGood = results.accuracy >= 70;

    return (
      <div className={styles.container}>
        <motion.div
          className={styles.results}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className={styles.resultIcon}>
            {isPerfect ? '🎉' : isGood ? '👍' : '📚'}
          </div>
          <h1>{isPerfect ? 'Perfect!' : isGood ? 'Great Job!' : 'Keep Practicing!'}</h1>

          <Card variant="elevated" padding="lg" className={styles.resultCard}>
            <div className={styles.resultStats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>
                  {results.correctAnswers}/{results.totalQuestions}
                </span>
                <span className={styles.statLabel}>Correct</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{Math.round(results.accuracy)}%</span>
                <span className={styles.statLabel}>Accuracy</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>
                  {(results.averageTimeMs / 1000).toFixed(1)}s
                </span>
                <span className={styles.statLabel}>Avg Time</span>
              </div>
            </div>
          </Card>

          <div className={styles.resultActions}>
            <Button variant="primary" size="lg" fullWidth onClick={handleBackToSelect}>
              Continue
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz mode
  const currentQuestion = activeQuiz.currentQuestion;
  if (!currentQuestion) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const relatedId = currentQuestion.relatedItemId;
  const relatedEnding = mode === 'noun-quiz'
    ? getNounEndingById(relatedId.replace('noun-', ''))
    : getVerbEndingById(relatedId.replace('verb-', ''));

  return (
    <div className={styles.container}>
      <header className={styles.quizHeader}>
        <Button variant="ghost" size="sm" onClick={handleBackToSelect}>
          ✕
        </Button>
        <ProgressBar
          value={activeQuiz.progress.percent}
          size="sm"
          className={styles.quizProgress}
        />
        <span className={styles.questionNum}>
          {activeQuiz.progress.current}/{activeQuiz.progress.total}
        </span>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          className={styles.question}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <div className={styles.prompt}>{currentQuestion.prompt}</div>

          {currentQuestion.promptDisplay && (
            <div className={styles.promptDisplay}>{currentQuestion.promptDisplay}</div>
          )}

          <div className={styles.options}>
            {currentQuestion.options.map((option) => (
              <OptionButton
                key={option}
                label={option}
                state={getOptionState(option)}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
              />
            ))}
          </div>

          {selectedAnswer !== null && relatedEnding && (
            <motion.div
              className={styles.feedback}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={`${styles.feedbackMsg} ${isCorrect ? styles.correct : styles.incorrect}`}>
                {isCorrect ? '✓ Correct!' : `✗ Answer: ${currentQuestion.correctAnswer}`}
              </div>
              <div className={styles.feedbackDetail}>
                <span className={styles.feedbackGreek}>
                  {relatedEnding.exampleWord || relatedEnding.ending}
                </span>
                {relatedEnding.exampleMeaning && (
                  <span className={styles.feedbackMeaning}>{relatedEnding.exampleMeaning}</span>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
