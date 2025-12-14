import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './NavBar.module.css';

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/alphabet', label: 'Alphabet', icon: 'Α' },
  { path: '/parsing', label: 'Parse', icon: 'λύω' },
  { path: '/progress', label: 'Stats', icon: '📊' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export function NavBar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
                {isActive && (
                  <motion.div
                    className={styles.indicator}
                    layoutId="nav-indicator"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
