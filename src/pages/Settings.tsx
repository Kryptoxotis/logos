import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card } from '../components/ui';
import { useSettings } from '../hooks/useSettings';
import { useProgress } from '../hooks/useProgress';
import { exportAllData, importAllData } from '../lib/storage';
import styles from './Settings.module.css';

export function Settings() {
  const { settings, toggleDarkMode, togglePhoneticGuide, setQuizSize } = useSettings();
  const { resetAll } = useProgress();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = async () => {
    try {
      const data = await exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `krypto-greek-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await importAllData(text);
      setImportStatus('Import successful! Refresh to see changes.');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus('Import failed. Please check the file format.');
    }
  };

  const handleReset = async () => {
    await resetAll();
    setShowResetConfirm(false);
  };

  const quizSizeOptions = [5, 10, 15, 20];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Settings</h1>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Appearance</h2>
        <Card variant="default" padding="none">
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Dark Mode</span>
              <span className={styles.settingDesc}>Use dark color scheme</span>
            </div>
            <button
              className={`${styles.toggle} ${settings.darkMode ? styles.active : ''}`}
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Learning</h2>
        <Card variant="default" padding="none">
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Show Phonetic Guide</span>
              <span className={styles.settingDesc}>Display pronunciation hints</span>
            </div>
            <button
              className={`${styles.toggle} ${settings.showPhoneticGuide ? styles.active : ''}`}
              onClick={togglePhoneticGuide}
              aria-label="Toggle phonetic guide"
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Quiz Size</span>
              <span className={styles.settingDesc}>Questions per quiz session</span>
            </div>
            <div className={styles.quizSizeOptions}>
              {quizSizeOptions.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeOption} ${settings.quizSize === size ? styles.active : ''}`}
                  onClick={() => setQuizSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Data</h2>
        <Card variant="default" padding="none">
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Export Progress</span>
              <span className={styles.settingDesc}>Download your data as JSON</span>
            </div>
            <Button variant="secondary" size="sm" onClick={handleExport}>
              Export
            </Button>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Import Progress</span>
              <span className={styles.settingDesc}>Restore from backup file</span>
            </div>
            <label className={styles.importButton}>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className={styles.fileInput}
              />
              <span className={styles.importLabel}>Import</span>
            </label>
          </div>

          {importStatus && (
            <div className={styles.importStatus}>
              {importStatus}
            </div>
          )}
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Danger Zone</h2>
        <Card variant="outlined" padding="none" className={styles.dangerCard}>
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Reset All Progress</span>
              <span className={styles.settingDesc}>This cannot be undone</span>
            </div>
            <Button variant="danger" size="sm" onClick={() => setShowResetConfirm(true)}>
              Reset
            </Button>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <div className={styles.about}>
          <h3>Krypto Greek</h3>
          <p>Unlock the original text</p>
          <p className={styles.version}>Version 1.0.0</p>
        </div>
      </section>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modalContent}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
          >
            <h3>Reset All Progress?</h3>
            <p>This will delete all your learning progress, quiz history, and SRS data. This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <Button variant="ghost" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleReset}>
                Yes, Reset Everything
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
