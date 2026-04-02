// src/App.jsx
// Root component.
// Owns the guesses state and persistence logic.
// Renders the two-column layout: GuessInput + GuessList | SuggestionsPanel

import { useState, useEffect } from 'react';
import Header          from './components/Header';
import GuessInput      from './components/GuessInput';
import GuessList       from './components/GuessList';
import SuggestionsPanel from './components/SuggestionsPanel';
import { saveGuesses, loadGuesses, clearGuesses } from './utils/helpers';

export default function App() {
  // ── State ──────────────────────────────────────────────────────────────
  // Guesses are loaded from localStorage on first render
  const [guesses, setGuesses] = useState(() => loadGuesses());

  // Set of lowercase words already added — used for duplicate detection
  const existingWords = new Set(guesses.map(g => g.word));

  // ── Persist guesses whenever they change ──────────────────────────────
  useEffect(() => {
    saveGuesses(guesses);
  }, [guesses]);

  // ── Handlers ──────────────────────────────────────────────────────────

  /** Add a new { word, rank } object to the list */
  function handleAddGuess(guess) {
    setGuesses(prev => [...prev, guess]);
  }

  /** Remove one guess by word */
  function handleRemove(word) {
    setGuesses(prev => prev.filter(g => g.word !== word));
  }

  /** Clear all guesses + localStorage */
  function handleClear() {
    clearGuesses();
    setGuesses([]);
  }

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />

      {/* Main content — two column layout on md+ screens */}
      <main className="
        flex-1 w-full max-w-5xl mx-auto
        flex flex-col md:flex-row gap-6
        px-4 py-6
      ">

        {/* ── Left column: input + guess list ── */}
        <section className="flex-1 flex flex-col gap-5">
          {/* Page heading */}
          <div>
            <h2 className="text-text font-semibold text-sm uppercase tracking-widest mb-1">
              Your Guesses
            </h2>
            <p className="text-subtext text-xs">
              Enter each word you've tried and its rank from Contexto.
            </p>
          </div>

          {/* Input bar */}
          <GuessInput
            onAddGuess={handleAddGuess}
            existingWords={existingWords}
          />

          {/* Sorted guess list */}
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
            </p>
          </div>

          <SuggestionsPanel guesses={guesses} />
        </section>
      </main>
    </div>
  );
}