import { useState, useEffect, useCallback } from 'react';
import type { UserSettings } from '../types';
import { getSettings, updateSettings } from '../lib/storage';

const defaultSettings: UserSettings = {
  darkMode: true,
  soundEnabled: true,
  hapticFeedback: true,
  showPhoneticGuide: true,
  quizSize: 10,
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    // Apply dark mode to document
    document.documentElement.setAttribute(
      'data-theme',
      settings.darkMode ? 'dark' : 'light'
    );
  }, [settings.darkMode]);

  const loadSettings = async () => {
    try {
      const loaded = await getSettings();
      setSettings(loaded);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const update = useCallback(async (partial: Partial<UserSettings>) => {
    try {
      const updated = await updateSettings(partial);
      setSettings(updated);
      return updated;
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    return update({ darkMode: !settings.darkMode });
  }, [settings.darkMode, update]);

  const toggleSound = useCallback(() => {
    return update({ soundEnabled: !settings.soundEnabled });
  }, [settings.soundEnabled, update]);

  const toggleHapticFeedback = useCallback(() => {
    return update({ hapticFeedback: !settings.hapticFeedback });
  }, [settings.hapticFeedback, update]);

  const togglePhoneticGuide = useCallback(() => {
    return update({ showPhoneticGuide: !settings.showPhoneticGuide });
  }, [settings.showPhoneticGuide, update]);

  const setQuizSize = useCallback((size: number) => {
    return update({ quizSize: size });
  }, [update]);

  return {
    settings,
    isLoading,
    update,
    toggleDarkMode,
    toggleSound,
    toggleHapticFeedback,
    togglePhoneticGuide,
    setQuizSize,
  };
}
