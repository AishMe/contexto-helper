// src/components/GuessList.jsx
// Displays all guesses sorted by rank.
// Includes a sort toggle and a clear-all button.

import { useState } from 'react';
import { sortGuesses } from '../utils/helpers';
import GuessItem from './GuessItem';

/**
 * @param {Array<{word: string, rank: number}>} guesses
 * @param {Function} onRemove  — remove a single guess by word
 * @param {Function} onClear   — clear all guesses
 */
export default function GuessList({ guesses, onRemove, onClear }) {
  // Sort direction: 'asc' = best rank first (lowest number)
  const [sortOrder, setSortOrder] = useState('asc');

  const sorted = sortGuesses(guesses, sortOrder);

  // ── Stats bar ─────────────────────────────────────────────────────────
  const best  = guesses.length ? Math.min(...guesses.map(g => g.rank)) : null;
  const total = guesses.length;

  return (
    <div className="flex flex-col gap-3">

      {/* Header row: stats + controls */}
      <div className="flex items-center justify-between text-xs text-subtext">
        <span>
          {total > 0
            ? `${total} guess${total !== 1 ? 'es' : ''} · Best: #${best}`
            : 'No guesses yet'}
        </span>

        {total > 0 && (
          <div className="flex gap-3">
            {/* Sort toggle */}
            <button
              onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
              className="hover:text-text transition-colors"
              title="Toggle sort order"
            >
              {sortOrder === 'asc' ? '↑ Best first' : '↓ Worst first'}
            </button>

            {/* Clear all */}
            <button
              onClick={onClear}
              className="hover:text-red transition-colors"
              title="Clear all guesses"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Guess rows */}
      {sorted.length === 0 ? (
        // Empty state — mirrors Contexto's minimal placeholder style
        <div className="
          border border-dashed border-border rounded-lg
          py-10 text-center text-muted text-sm
        ">
          Add your first guess above
        </div>
      ) : (
        <div className="flex flex-col gap-1.5 max-h-[420px] overflow-y-auto pr-1">
          {sorted.map(guess => (
            <GuessItem
              key={guess.word}
              guess={guess}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}