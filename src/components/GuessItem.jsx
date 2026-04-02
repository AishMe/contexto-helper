// src/components/GuessItem.jsx
// Renders a single guess row with rank badge + remove button.
// Colour coding is derived from rank via getRankClasses().

import { getRankClasses, getRankColor } from '../utils/helpers';

/**
 * @param {{ word: string, rank: number }} guess
 * @param {Function} onRemove — called when the × button is clicked
 */
export default function GuessItem({ guess, onRemove }) {
  const rankClasses = getRankClasses(guess.rank);
  const color       = getRankColor(guess.rank);

  // Dot colour for the small indicator
  const dotColor = {
    green:  'bg-green',
    yellow: 'bg-yellow',
    red:    'bg-red',
  }[color];

  return (
    <div className="
      flex items-center justify-between
      bg-surface border border-border rounded-lg
      px-4 py-2.5 group
      hover:border-muted transition-colors
    ">
      {/* Left: coloured dot + word */}
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
        <span className="text-text font-sans text-sm capitalize">
          {guess.word}
        </span>
      </div>

      {/* Right: rank badge + remove button */}
      <div className="flex items-center gap-2">
        <span className={`
          badge-transition border rounded px-2 py-0.5
          font-mono text-xs font-medium ${rankClasses}
        `}>
          #{guess.rank}
        </span>

        {/* Remove button — only visible on hover */}
        <button
          onClick={() => onRemove(guess.word)}
          title="Remove guess"
          className="
            text-muted hover:text-red opacity-0 group-hover:opacity-100
            transition-all text-xs leading-none
          "
        >
          ✕
        </button>
      </div>
    </div>
  );
}