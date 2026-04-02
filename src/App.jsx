// src/App.jsx
// Root component.
// Owns the guesses state, persistence logic, and settings panel visibility.

import { useState, useEffect } from 'react';
import Header           from './components/Header';
import GuessInput       from './components/GuessInput';
import GuessList        from './components/GuessList';
import SuggestionsPanel from './components/SuggestionsPanel';
import SettingsPanel    from './components/SettingsPanel';
import { saveGuesses, loadGuesses, clearGuesses } from './utils/helpers';

export default function App() {
  // ── State ────────────────────────────────────────────────────────────────
  const [guesses,         setGuesses]         = useState(() => loadGuesses());
  const [settingsOpen,    setSettingsOpen]     = useState(false);
  // Increment this to force SuggestionsPanel to re-read settings after save
  const [settingsVersion, setSettingsVersion] = useState(0);

  // Set of lowercase words already added — used for duplicate detection
  const existingWords = new Set(guesses.map(g => g.word));

  // ── Persist guesses whenever they change ─────────────────────────────────
  useEffect(() => {
    saveGuesses(guesses);
  }, [guesses]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleAddGuess(guess) {
    setGuesses(prev => [...prev, guess]);
  }

  function handleRemove(word) {
    setGuesses(prev => prev.filter(g => g.word !== word));
  }

  function handleClear() {
    clearGuesses();
    setGuesses([]);
  }

  // Called when user saves settings — bumps version so panel re-renders
  function handleSettingsChange() {
    setSettingsVersion(v => v + 1);
    setSettingsOpen(false);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header onSettingsClick={() => setSettingsOpen(true)} />

      {/* Settings modal */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onChange={handleSettingsChange}
      />

      {/* Main content — two column layout on md+ screens */}
      <main className="
        flex-1 w-full max-w-5xl mx-auto
        flex flex-col md:flex-row gap-6
        px-4 py-6
      ">
        {/* ── Left column: input + guess list ── */}
        <section className="flex-1 flex flex-col gap-5">
          <div>
            <h2 className="text-text font-semibold text-sm uppercase tracking-widest mb-1">
              Your Guesses
            </h2>
            <p className="text-subtext text-xs">
              Enter each word you've tried and its rank from Contexto.
            </p>
          </div>

          <GuessInput
            onAddGuess={handleAddGuess}
            existingWords={existingWords}
          />

          <GuessList
            guesses={guesses}
            onRemove={handleRemove}
            onClear={handleClear}
          />
        </section>

        {/* Vertical divider (desktop only) */}
        <div className="hidden md:block w-px bg-border" />

        {/* ── Right column: AI suggestions ── */}
        <section className="w-full md:w-80 flex flex-col gap-5">
          <div>
            <p className="text-subtext text-xs">
              The AI analyses your guesses and suggests words likely to rank higher.
              Use ⚙️ Settings to switch to a smarter model.
            </p>
          </div>

          {/* key prop forces re-mount when settings change */}
          <SuggestionsPanel
            key={settingsVersion}
            guesses={guesses}
          />
        </section>
      </main>
    </div>
  );
}