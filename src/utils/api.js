// src/utils/api.js
// Handles all AI suggestion requests.
// - Default (free):  POST /api/suggest  → serverless proxy → OpenRouter free
// - BYOK:            calls provider API directly from browser using user's own key
//                    (key never touches our server)

import { loadSettings } from '../components/SettingsPanel';

// ── Build the improved prompt — shared across all providers ───────────────────
function buildPrompt(guesses) {
  const sorted = [...guesses].sort((a, b) => a.rank - b.rank);

  // Rank gradient helps the model understand how close we are
  const best  = sorted[0].rank;
  const worst = sorted[sorted.length - 1].rank;
  const gradientInfo = sorted.length >= 2
    ? `Rank gap: best is #${best}, worst is #${worst}. ${best < 100 ? 'Very close — stay in the same tight semantic field.' : best < 300 ? 'Getting warm — explore closely related words.' : 'Far away — try broader semantic angles.'}`
    : '';

  return `You are an expert at Contexto, a word similarity game. The secret word ranks guesses by semantic closeness — #1 means the guess IS the secret word.

Player's guesses (best rank first):
${sorted.map(g => `  "${g.word}" → #${g.rank}`).join('\n')}

${gradientInfo}

Rules for your suggestions:
- Suggest words semantically CLOSER to the best-ranked guesses
- Do NOT suggest any of these already-guessed words: ${sorted.map(g => g.word).join(', ')}
- Think: synonyms, subcategories, associated objects, related actions, descriptors
- Prefer specific concrete nouns/verbs over vague abstract words
- Each of the 5 suggestions should explore a slightly different semantic angle

Respond with ONLY valid JSON, no markdown, no explanation outside the JSON:
{"suggestions":["WORD1","WORD2","WORD3","WORD4","WORD5"],"strategy":"ONE_SHORT_ACTIONABLE_TIP"}`;
}

// ── Route to correct handler based on saved settings ─────────────────────────
export async function fetchSuggestions(guesses) {
  const settings = loadSettings();

  // Use server-side proxy for free tier (no user key needed)
  if (settings.providerId === 'openrouter-free') {
    return fetchViaProxy(guesses);
  }

  // Use user's own key directly from the browser
  return fetchViaBYOK(guesses, settings);
}

// ── Default: server-side proxy ────────────────────────────────────────────────
async function fetchViaProxy(guesses) {
  const response = await fetch('/api/suggest', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ guesses }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${response.status}`);
  }

  return response.json();
}

// ── BYOK: call provider API directly from the browser ────────────────────────
async function fetchViaBYOK(guesses, settings) {
  const { providerId, modelId, apiKey } = settings;

  if (!apiKey) throw new Error('No API key set. Open Settings and add your key.');

  const prompt = buildPrompt(guesses);
  let raw = '';

  if (providerId === 'openai' || providerId === 'openrouter') {
    // OpenAI-compatible endpoint (OpenAI + OpenRouter share the same format)
    const baseUrl = providerId === 'openai'
      ? 'https://api.openai.com/v1'
      : 'https://openrouter.ai/api/v1';

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
        ...(providerId === 'openrouter' && {
          'HTTP-Referer': 'https://contexto-helper.vercel.app',
          'X-Title':      'Contexto Helper',
        }),
      },
      body: JSON.stringify({
        model:       modelId,
        messages:    [{ role: 'user', content: prompt }],
        max_tokens:  500,
        temperature: 0.4, // lower = more focused suggestions
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error: ${res.status}`);
    }

    const data = await res.json();
    raw = data.choices?.[0]?.message?.content || '';

  } else if (providerId === 'anthropic') {
    // Anthropic Messages API format
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type':      'application/json',
      },
      body: JSON.stringify({
        model:      modelId,
        max_tokens: 500,
        messages:   [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Anthropic API error: ${res.status}`);
    }

    const data = await res.json();
    raw = data.content?.[0]?.text || '';
  }

  // Extract JSON from response — models sometimes wrap it in extra text
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI returned an unexpected response. Try again.');

  return JSON.parse(jsonMatch[0]);
}