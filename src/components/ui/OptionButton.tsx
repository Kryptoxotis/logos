import { motion } from 'framer-motion';
import styles from './OptionButton.module.css';

type OptionState = 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled';

interface OptionButtonProps {
  label: string;
  state?: OptionState;
  onClick?: () => void;
  disabled?: boolean;
  isGreek?: boolean;
  className?: string;
}

export function OptionButton({
  label,
  state = 'default',
  onClick,
  disabled = false,
  isGreek = false,
  className = '',
}: OptionButtonProps) {
  return (
    <motion.button
      className={`${styles.option} ${styles[state]} ${isGreek ? styles.greek : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || state === 'disabled'}
      whileTap={state === 'default' ? { scale: 0.98 } : undefined}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <span className={styles.label}>{label}</span>
      {state === 'correct' && (
        <motion.span
          className={styles.icon}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          ✓
        </motion.span>
      )}
      {state === 'incorrect' && (
        <motion.span
          className={styles.icon}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          ✗
        </motion.span>
      )}
    </motion.button>
  );
}
