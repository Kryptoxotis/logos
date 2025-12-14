import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { NavBar } from './components/ui/NavBar';
import { Home, Alphabet, AlphabetQuiz, Parsing, Settings, Progress } from './pages';
import { useSettings } from './hooks/useSettings';
import { initializeSRSItems } from './lib/storage';
import './styles/globals.css';

function AppContent() {
  const { settings, isLoading } = useSettings();

  useEffect(() => {
    // Initialize SRS items on first load
    initializeSRSItems();
  }, []);

  useEffect(() => {
    // Apply theme
    document.documentElement.setAttribute(
      'data-theme',
      settings.darkMode ? 'dark' : 'light'
    );
  }, [settings.darkMode]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <>
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alphabet" element={<Alphabet />} />
            <Route path="/alphabet/quiz" element={<AlphabetQuiz />} />
            <Route path="/parsing" element={<Parsing />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AnimatePresence>
      </main>
      <NavBar />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
