import { motion } from 'framer-motion';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'accent';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  variant = 'default',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={`${styles.track} ${styles[size]}`}>
        <motion.div
          className={`${styles.fill} ${styles[variant]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <span className={styles.label}>{Math.round(percentage)}%</span>
      )}
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  variant?: 'default' | 'success' | 'accent';
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  showLabel = true,
  variant = 'default',
  className = '',
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`${styles.circular} ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className={styles.circularTrack}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          className={`${styles.circularFill} ${styles[`circular-${variant}`]}`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      {showLabel && (
        <div className={styles.circularLabel}>
          <span className={styles.circularValue}>{Math.round(percentage)}</span>
          <span className={styles.circularPercent}>%</span>
        </div>
      )}
    </div>
  );
}
