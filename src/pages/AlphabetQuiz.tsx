import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, OptionButton, ProgressBar, Card } from '../components/ui';
import { useQuiz } from '../hooks/useQuiz';
import { useProgress } from '../hooks/useProgress';
import { useSettings } from '../hooks/useSettings';
import { getLetterById } from '../data/alphabet';
import styles from './AlphabetQuiz.module.css';

type QuizPhase = 'ready' | 'quiz' | 'feedback' | 'results';

export function AlphabetQuiz() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { refreshProgress, incrementQuizCount } = useProgress();
  const {
    currentQuestion,
    isComplete,
    isLoading,
    progress: quizProgress,
    startQuiz,
    submitAnswer,
    nextQuestion,
    getResults,
    resetQuiz,
  } = useQuiz('letter');

  const [phase, setPhase] = useState<QuizPhase>('ready');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (isComplete && phase === 'quiz') {
      handleQuizComplete();
    }
  }, [isComplete]);

  const handleStart = async () => {
    await startQuiz(settings.quizSize);
    setPhase('quiz');
  };

  const handleAnswerSelect = async (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    setSelectedAnswer(answer);
    const correct = await submitAnswer(answer);
    setIsCorrect(correct);
    setPhase('feedback');

    // Auto-advance after feedback
    setTimeout(() => {
      handleNextQuestion();
    }, correct ? 1000 : 1500);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    nextQuestion();
    setPhase('quiz');
  };

  const handleQuizComplete = async () => {
    await incrementQuizCount();
    await refreshProgress();
    setPhase('results');
  };

  const handleRestart = () => {
    resetQuiz();
    setSelectedAnswer(null);
    setIsCorrect(null);
    setPhase('ready');
  };

  const getOptionState = (option: string) => {
    if (selectedAnswer === null) return 'default';
    if (option === currentQuestion?.correctAnswer) return 'correct';
    if (option === selectedAnswer && !isCorrect) return 'incorrect';
    return 'disabled';
  };

  const isGreekOption = () => {
    if (!currentQuestion) return false;
    return ['name-to-letter', 'upper-to-lower'].includes(currentQuestion.type);
  };

  // Ready phase
  if (phase === 'ready') {
    return (
      <div className={styles.container}>
        <motion.div
          className={styles.readyScreen}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.readyIcon}>Αα</div>
          <h1 className={styles.readyTitle}>Alphabet Quiz</h1>
          <p className={styles.readyDesc}>
            Test your knowledge of the Greek alphabet with {settings.quizSize} questions
          </p>
          <div className={styles.quizTypes}>
            <div className={styles.quizType}>
              <span className={styles.typeIcon}>α → </span>
              <span>Identify letter names</span>
            </div>
            <div className={styles.quizType}>
              <span className={styles.typeIcon}>Alpha → </span>
              <span>Find Greek letters</span>
            </div>
            <div className={styles.quizType}>
              <span className={styles.typeIcon}>α ↔ Α</span>
              <span>Match cases</span>
            </div>
          </div>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleStart}
            isLoading={isLoading}
          >
            Start Quiz
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={() => navigate('/alphabet')}
            className={styles.backButton}
          >
            ← Back to Alphabet
          </Button>
        </motion.div>
      </div>
    );
  }

  // Results phase
  if (phase === 'results') {
    const results = getResults();
    const isPerfect = results.accuracy === 100;
    const isGood = results.accuracy >= 70;

    return (
      <div className={styles.container}>
        <motion.div
          className={styles.resultsScreen}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className={styles.resultIcon}>
            {isPerfect ? '🎉' : isGood ? '👍' : '📚'}
          </div>
          <h1 className={styles.resultTitle}>
            {isPerfect ? 'Perfect!' : isGood ? 'Great Job!' : 'Keep Practicing!'}
          </h1>

          <Card variant="elevated" padding="lg" className={styles.resultCard}>
            <div className={styles.resultStats}>
              <div className={styles.resultStat}>
                <span className={styles.resultValue}>
                  {results.correctAnswers}/{results.totalQuestions}
                </span>
                <span className={styles.resultLabel}>Correct</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultValue}>
                  {Math.round(results.accuracy)}%
                </span>
                <span className={styles.resultLabel}>Accuracy</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultValue}>
                  {(results.averageTimeMs / 1000).toFixed(1)}s
                </span>
                <span className={styles.resultLabel}>Avg Time</span>
              </div>
            </div>
          </Card>

          <div className={styles.resultActions}>
            <Button variant="primary" size="lg" fullWidth onClick={handleRestart}>
              Try Again
            </Button>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => navigate('/alphabet')}
            >
              Back to Alphabet
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz phase
  if (!currentQuestion) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  // Get additional info for feedback
  const relatedLetterId = currentQuestion.relatedItemId.replace('letter-', '');
  const relatedLetter = getLetterById(relatedLetterId);

  return (
    <div className={styles.container}>
      <header className={styles.quizHeader}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/alphabet')}>
          ✕
        </Button>
        <ProgressBar
          value={quizProgress.percent}
          size="sm"
          className={styles.progressBar}
        />
        <span className={styles.questionCount}>
          {quizProgress.current}/{quizProgress.total}
        </span>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          className={styles.questionContainer}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.2 }}
        >
          <div className={styles.prompt}>
            {currentQuestion.prompt}
          </div>

          {currentQuestion.promptDisplay && (
            <motion.div
              className={styles.promptDisplay}
              animate={isCorrect === false ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
              {currentQuestion.promptDisplay}
            </motion.div>
          )}

          <div className={styles.options}>
            {currentQuestion.options.map((option) => (
              <OptionButton
                key={option}
                label={option}
                state={getOptionState(option)}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
                isGreek={isGreekOption()}
              />
            ))}
          </div>

          {phase === 'feedback' && relatedLetter && (
            <motion.div
              className={styles.feedback}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={`${styles.feedbackMessage} ${isCorrect ? styles.correct : styles.incorrect}`}>
                {isCorrect ? '✓ Correct!' : `✗ The answer was: ${currentQuestion.correctAnswer}`}
              </div>
              <div className={styles.feedbackInfo}>
                <span className={styles.feedbackGreek}>
                  {relatedLetter.uppercase} {relatedLetter.lowercase}
                </span>
                <span className={styles.feedbackName}>{relatedLetter.name}</span>
                <span className={styles.feedbackSound}>{relatedLetter.phoneticGuide}</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
