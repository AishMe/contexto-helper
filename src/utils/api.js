// src/utils/api.js
// Centralises all network calls so components stay free of fetch() logic.
// In production (Vercel), POST /api/suggest is handled by api/suggest.js.
// In local dev, you can test with a mock or run `vercel dev`.

/**
 * Fetches AI word suggestions based on the player's current guesses.
 *
 * @param {Array<{word: string, rank: number}>} guesses — All guesses so far
 * @returns {Promise<{suggestions: string[], strategy: string}>}
 */
export async function fetchSuggestions(guesses) {
  const response = await fetch('/api/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Send only the data the serverless function needs
    body: JSON.stringify({ guesses }),
  });

  if (!response.ok) {
    // Surface the HTTP error message to the caller
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${response.status}`);
  }

  return response.json(); // { suggestions: [...], strategy: "..." }
}