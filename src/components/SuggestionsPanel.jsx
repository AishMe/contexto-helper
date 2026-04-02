// src/components/SuggestionsPanel.jsx
// Shows AI-generated word suggestions and a strategy tip.
// Includes animated loading state and a retry button on error.

import { useState, useEffect } from 'react';
import { fetchSuggestions } from '../utils/api';

// ── Loading messages — cycles every 3s so user knows it's still working ───────
const LOADING_MESSAGES = [
  '🔍 Analysing your guesses…',
  '🧠 Finding semantic patterns…',
  '💡 Thinking of nearby words…',
  '⏳ Free models can take up to 30s…',
  '🎯 Narrowing down candidates…',
  '🙏 Almost there, please wait…',
];

function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-accent/20 bg-accent/5 rounded-lg px-4 py-4 text-center">
        {/* Bouncing dots */}
        <div className="flex justify-center gap-1.5 mb-3">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-accent animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-accent text-sm font-medium">{LOADING_MESSAGES[msgIndex]}</p>
        <p className="text-subtext text-xs mt-1">Free AI models can take 20–40 seconds</p>
      </div>

      {/* Skeleton rows */}
      <div className="flex flex-col gap-1.5 animate-pulse">
        {[100, 80, 90, 70, 85].map((w, i) => (
          <div key={i} className="h-9 bg-surface rounded-lg" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

/**
 * @param {Array<{word: string, rank: number}>} guesses — current guess list
 */
export default function SuggestionsPanel({ guesses }) {
  const [suggestions, setSuggestions] = useState([]);
  const [strategy,    setStrategy]    = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  // ── Fetch suggestions ───────────────────────────────────────────────────
  async function handleGetSuggestions() {
    if (guesses.length < 2) {
      setError('Add at least 2 guesses to get suggestions.');
      return;
    }

    setLoading(true);
    setError('');
    setSuggestions([]);
    setStrategy('');

    try {
      const data = await fetchSuggestions(guesses);
      setSuggestions(data.suggestions || []);
      setStrategy(data.strategy || '');
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-text font-semibold text-sm uppercase tracking-widest">
          AI Suggestions
        </h2>
        <button
          onClick={handleGetSuggestions}
          disabled={loading}
          className="
            bg-accent hover:bg-violet-500 disabled:opacity-50
            text-white text-xs font-semibold px-4 py-2 rounded-lg
            transition-all active:scale-95 transform
          "
        >
          {loading ? 'Thinking…' : 'Suggest'}
        </button>
      </div>

      {/* Error state — with retry button */}
      {error && !loading && (
        <div className="border border-red/20 bg-red/5 rounded-lg px-4 py-3 flex flex-col gap-2">
          <p className="text-red text-xs">{error}</p>
          {/* Only show retry if it's a real error, not a validation message */}
          {guesses.length >= 2 && (
            <button
              onClick={handleGetSuggestions}
              className="
                self-start text-xs text-red border border-red/30
                rounded-lg px-3 py-1.5 hover:bg-red/10 transition-colors
              "
            >
              🔄 Try Again
            </button>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && <LoadingState />}

      {/* Suggestion list */}
      {!loading && suggestions.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {suggestions.map((word, idx) => (
            <div
              key={word}
              className="
                flex items-center gap-3
                bg-surface border border-border rounded-lg
                px-4 py-2.5 hover:border-accent/50 transition-colors
              "
            >
              <span className="text-subtext font-mono text-xs w-5 text-right">{idx + 1}.</span>
              <span className="text-text text-sm font-medium capitalize">{word}</span>
            </div>
          ))}
        </div>
      )}

      {/* Strategy tip */}
      {!loading && strategy && (
        <div className="border border-accent/20 bg-accent/5 rounded-lg px-4 py-3 text-xs text-subtext leading-relaxed">
          <span className="text-accent font-semibold block mb-1">💡 Strategy</span>
          {strategy}
        </div>
      )}

      {/* Resuggest button — shown after results to get fresh suggestions */}
      {!loading && suggestions.length > 0 && (
        <button
          onClick={handleGetSuggestions}
          className="text-xs text-muted hover:text-subtext transition-colors text-center"
        >
          🔄 Get new suggestions
        </button>
      )}

      {/* Empty state */}
      {!loading && suggestions.length === 0 && !error && (
        <div className="border border-dashed border-border rounded-lg py-10 text-center text-muted text-sm">
          Add guesses, then click Suggest
        </div>
      )}
    </div>
  );
}