import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, ProgressBar } from '../components/ui';
import { greekAlphabet } from '../data/alphabet';
import { useProgress } from '../hooks/useProgress';
import { useSettings } from '../hooks/useSettings';
import styles from './Alphabet.module.css';

type ViewMode = 'grid' | 'study';

export function Alphabet() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedLetter, setSelectedLetter] = useState<number>(0);
  const { progress } = useProgress();
  const { settings } = useSettings();

  const handleLetterClick = (index: number) => {
    setSelectedLetter(index);
    setViewMode('study');
  };

  const handlePrevious = () => {
    setSelectedLetter(prev => (prev > 0 ? prev - 1 : greekAlphabet.length - 1));
  };

  const handleNext = () => {
    setSelectedLetter(prev => (prev < greekAlphabet.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Greek Alphabet</h1>
        <p className={styles.subtitle}>
          {progress.alphabet.masteredLetters} of {progress.alphabet.totalLetters} mastered
        </p>
        <ProgressBar
          value={progress.alphabet.masteredLetters}
          max={progress.alphabet.totalLetters}
          showLabel
          variant="accent"
        />
      </header>

      <div className={styles.viewToggle}>
        <button
          className={`${styles.toggleButton} ${viewMode === 'grid' ? styles.active : ''}`}
          onClick={() => setViewMode('grid')}
        >
          Grid View
        </button>
        <button
          className={`${styles.toggleButton} ${viewMode === 'study' ? styles.active : ''}`}
          onClick={() => setViewMode('study')}
        >
          Study Mode
        </button>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            className={styles.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {greekAlphabet.map((letter, index) => (
              <motion.button
                key={letter.id}
                className={styles.letterCard}
                onClick={() => handleLetterClick(index)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={styles.letterGreek}>{letter.uppercase}</span>
                <span className={styles.letterLower}>{letter.lowercase}</span>
                <span className={styles.letterName}>{letter.name}</span>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="study"
            className={styles.studyMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.studyNav}>
              <Button variant="ghost" size="sm" onClick={handlePrevious}>
                ← Previous
              </Button>
              <span className={styles.studyPosition}>
                {selectedLetter + 1} / {greekAlphabet.length}
              </span>
              <Button variant="ghost" size="sm" onClick={handleNext}>
                Next →
              </Button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLetter}
                className={styles.studyCard}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.letterDisplay}>
                  <span className={styles.studyUpper}>
                    {greekAlphabet[selectedLetter].uppercase}
                  </span>
                  <span className={styles.studyLower}>
                    {greekAlphabet[selectedLetter].lowercase}
                    {greekAlphabet[selectedLetter].lowercaseFinal && (
                      <span className={styles.finalForm}>
                        {' '}/ {greekAlphabet[selectedLetter].lowercaseFinal}
                      </span>
                    )}
                  </span>
                </div>

                <div className={styles.letterInfo}>
                  <h2 className={styles.studyName}>
                    {greekAlphabet[selectedLetter].name}
                  </h2>

                  {settings.showPhoneticGuide && (
                    <div className={styles.phonetic}>
                      <span className={styles.label}>Sound:</span>
                      <span className={styles.value}>
                        {greekAlphabet[selectedLetter].phoneticGuide}
                      </span>
                    </div>
                  )}

                  {greekAlphabet[selectedLetter].lowercaseFinal && (
                    <div className={styles.note}>
                      <span className={styles.label}>Note:</span>
                      <span className={styles.value}>
                        σ is used within words, ς at the end
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.actions}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate('/alphabet/quiz')}
        >
          Start Quiz
        </Button>
      </div>
    </div>
  );
}
