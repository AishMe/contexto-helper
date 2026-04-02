// src/utils/helpers.js
// Pure utility functions used across the app.
// Keeping logic here keeps components clean and testable.

// ── Rank → colour mapping (mirrors Contexto's colour scheme) ──────────────
// #1–100   → green  (very close to the answer)
// #101–500 → yellow (in the right neighbourhood)
// #501+    → red    (far away)

export function getRankColor(rank) {
  if (rank <= 100)  return 'green';
  if (rank <= 500)  return 'yellow';
  return 'red';
}

// Tailwind class sets for each colour band
export function getRankClasses(rank) {
  const color = getRankColor(rank);
  const map = {
    green:  'bg-green/10  text-green  border-green/30',
    yellow: 'bg-yellow/10 text-yellow border-yellow/30',
    red:    'bg-red/10    text-red    border-red/30',
  };
  return map[color];
}

// ── Sorting ───────────────────────────────────────────────────────────────
// Returns a new sorted array; does NOT mutate the original.

export function sortGuesses(guesses, order = 'asc') {
  return [...guesses].sort((a, b) =>
    order === 'asc' ? a.rank - b.rank : b.rank - a.rank
  );
}

// ── LocalStorage persistence ──────────────────────────────────────────────
// Wraps JSON serialisation so callers never touch localStorage directly.

const STORAGE_KEY = 'contexto_helper_guesses';

export function saveGuesses(guesses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guesses));
  } catch {
    // Silently fail if storage is unavailable (private browsing etc.)
  }
}

export function loadGuesses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearGuesses() {
  localStorage.removeItem(STORAGE_KEY);
}