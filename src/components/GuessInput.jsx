// src/components/GuessInput.jsx
// The top input bar — word + rank fields with validation.
// Closely mirrors Contexto's minimal input style.

import { useState } from 'react';

/**
 * @param {Function} onAddGuess — called with { word, rank } on submit
 */
export default function GuessInput({ onAddGuess, existingWords }) {
  const [word, setWord]   = useState('');
  const [rank, setRank]   = useState('');
  const [error, setError] = useState('');

  // ── Validation ────────────────────────────────────────────────────────
  function validate() {
    const trimmed = word.trim().toLowerCase();

    if (!trimmed)                        return 'Enter a word.';
    if (!/^[a-z]+$/.test(trimmed))       return 'Letters only, no spaces.';
    if (!rank || isNaN(rank) || +rank < 1) return 'Enter a valid rank (≥ 1).';
    if (existingWords.has(trimmed))      return `"${trimmed}" already added.`;

    return null; // no error
  }

  // ── Submit handler ────────────────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    onAddGuess({ word: word.trim().toLowerCase(), rank: parseInt(rank, 10) });

    // Reset fields
    setWord('');
    setRank('');
    setError('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 w-full"
      noValidate
    >
      <div className="flex gap-2">
        {/* Word input */}
        <input
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

      {/* Inline validation error */}
      {error && (
        <p className="text-red text-xs pl-1">{error}</p>
      )}
    </form>
  );
}