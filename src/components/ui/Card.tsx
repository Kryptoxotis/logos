import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import styles from './Card.module.css';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  clickable = false,
  className = '',
  ...props
}: CardProps) {
  return (
    <motion.div
      className={`${styles.card} ${styles[variant]} ${styles[`padding-${padding}`]} ${
        clickable ? styles.clickable : ''
      } ${className}`}
      whileHover={clickable ? { scale: 1.02 } : undefined}
      whileTap={clickable ? { scale: 0.98 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`${styles.header} ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return <h3 className={`${styles.title} ${className}`}>{children}</h3>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`${styles.content} ${className}`}>{children}</div>;
}
