// src/App.jsx
// Root component — owns guesses state, persistence, and settings visibility.

import { useState, useEffect } from 'react';
import Header           from './components/Header';
import GuessInput       from './components/GuessInput';
import GuessList        from './components/GuessList';
import SuggestionsPanel from './components/SuggestionsPanel';
import SettingsPanel    from './components/SettingsPanel';
import { saveGuesses, loadGuesses, clearGuesses } from './utils/helpers';

export default function App() {
  const [guesses,         setGuesses]         = useState(() => loadGuesses());
  const [settingsOpen,    setSettingsOpen]     = useState(false);
  const [settingsVersion, setSettingsVersion] = useState(0);

  const existingWords = new Set(guesses.map(g => g.word));

  useEffect(() => { saveGuesses(guesses); }, [guesses]);

  function handleAddGuess(guess)  { setGuesses(prev => [...prev, guess]); }
  function handleRemove(word)     { setGuesses(prev => prev.filter(g => g.word !== word)); }
  function handleClear()          { clearGuesses(); setGuesses([]); }
  function handleSettingsChange() { setSettingsVersion(v => v + 1); setSettingsOpen(false); }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header onSettingsClick={() => setSettingsOpen(true)} />

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onChange={handleSettingsChange}
      />

      <main className="
        flex-1 w-full max-w-5xl mx-auto
        flex flex-col md:flex-row gap-6
        px-3 sm:px-4 py-4 sm:py-6
      ">
        {/* ── Left column ── */}
        <section className="flex-1 flex flex-col gap-4 sm:gap-5 min-w-0">
          <div>
            <h2 className="text-text font-semibold text-sm uppercase tracking-widest mb-1">
              Your Guesses
            </h2>
            <p className="text-subtext text-xs">
              Enter each word you've tried and its rank from Contexto.
            </p>
          </div>

          <GuessInput onAddGuess={handleAddGuess} existingWords={existingWords} />
          <GuessList  guesses={guesses} onRemove={handleRemove} onClear={handleClear} />
        </section>

        {/* Divider — horizontal on mobile, vertical on desktop */}
        <div className="block md:hidden h-px bg-border" />
        <div className="hidden md:block w-px bg-border" />

        {/* ── Right column ── */}
        <section className="w-full md:w-80 flex flex-col gap-4 sm:gap-5 min-w-0">
          <div>
            <p className="text-subtext text-xs">
              The AI analyses your guesses and suggests words likely to rank higher.
              Use ⚙️ Settings to switch to a smarter model.
            </p>
          </div>

          <SuggestionsPanel key={settingsVersion} guesses={guesses} />
        </section>
      </main>
    </div>
  );
}