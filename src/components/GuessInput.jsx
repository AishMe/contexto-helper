// src/components/GuessInput.jsx
// The top input bar — word + rank fields with validation.
// Supports Enter key to submit for faster workflow.

import { useState, useRef, useEffect } from 'react';

/**
 * @param {Function} onAddGuess    — called with { word, rank } on submit
 * @param {Set}      existingWords — set of already-added words for dupe check
 */
export default function GuessInput({ onAddGuess, existingWords }) {
  const [word,  setWord]  = useState('');
  const [rank,  setRank]  = useState('');
  const [error, setError] = useState('');

  const wordRef = useRef(null);

  // Auto-focus the word input on mount
  useEffect(() => { wordRef.current?.focus(); }, []);

  // ── Validation ─────────────────────────────────────────────────────────
  function validate() {
    const trimmed = word.trim().toLowerCase();
    if (!trimmed)                          return 'Enter a word.';
    if (!/^[a-z]+$/.test(trimmed))         return 'Letters only, no spaces.';
    if (!rank || isNaN(rank) || +rank < 1) return 'Enter a valid rank (≥ 1).';
    if (existingWords.has(trimmed))        return `"${trimmed}" already added.`;
    return null;
  }

  // ── Submit handler ──────────────────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    onAddGuess({ word: word.trim().toLowerCase(), rank: parseInt(rank, 10) });

    // Reset and re-focus word input for fast back-to-back entry
    setWord('');
    setRank('');
    setError('');
    wordRef.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full" noValidate>
      <div className="flex gap-2">
        {/* Word input — Enter key submits the form */}
        <input
          ref={wordRef}
          type="text"
          value={word}
          onChange={e => { setWord(e.target.value); setError(''); }}
          placeholder="Enter a word…"
          autoComplete="off"
          spellCheck={false}
          className="
            flex-1 bg-surface border border-border rounded-lg px-4 py-3
            text-text placeholder-muted font-sans text-sm
            focus:outline-none focus:border-accent transition-colors
          "
        />

        {/* Rank input */}
        <input
          type="number"
          value={rank}
          onChange={e => { setRank(e.target.value); setError(''); }}
          placeholder="Rank"
          min="1"
          className="
            w-24 bg-surface border border-border rounded-lg px-3 py-3
            text-text placeholder-muted font-mono text-sm text-center
            focus:outline-none focus:border-accent transition-colors
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
          "
        />

        {/* Submit button */}
        <button
          type="submit"
          className="
            bg-accent hover:bg-violet-500 text-white font-semibold
            px-5 py-3 rounded-lg text-sm transition-colors
            active:scale-95 transform
          "
        >
          Add
        </button>
      </div>

      {/* Hint text */}
      <p className="text-muted text-xs pl-1">
        Press <kbd className="bg-surface border border-border rounded px-1 py-0.5 text-xs">Enter</kbd> to add quickly
      </p>

      {/* Inline validation error */}
      {error && <p className="text-red text-xs pl-1">{error}</p>}
    </form>
  );
}