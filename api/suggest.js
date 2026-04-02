// api/suggest.js
// Vercel Serverless Function — runs on the server, never exposed to the browser.
// Used only for the free tier (OpenRouter free models).
// BYOK requests go directly from browser to provider — never through here.
//
// Request  (POST): { guesses: Array<{ word: string, rank: number }> }
// Response (200):  { suggestions: string[], strategy: string }

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Manually load .env.local in development (vercel dev sometimes misses it)
try {
  const env = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
  env.split('\n').forEach(line => {
    const [key, val] = line.split('=');
    if (key && val) process.env[key.trim()] = val.trim();
  });
} catch {}

export default async function handler(req, res) {
  // ── Only allow POST ──────────────────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { guesses } = req.body;

  // ── Basic input validation ───────────────────────────────────────────────
  if (!Array.isArray(guesses) || guesses.length === 0) {
    return res.status(400).json({ error: 'guesses array is required' });
  }

  // Sort best-first so the model sees the most useful context first
  const sorted = [...guesses].sort((a, b) => a.rank - b.rank);
  const best   = sorted[0].rank;

  // ── Improved prompt with rank gradient context ───────────────────────────
  const gradientInfo = sorted.length >= 2
    ? `Rank gap: best is #${best}, worst is #${sorted[sorted.length - 1].rank}. ${best < 100 ? 'Very close — stay in the same tight semantic field.' : best < 300 ? 'Getting warm — explore closely related words.' : 'Far away — try broader semantic angles.'}`
    : '';

  const prompt = `You are an expert at Contexto, a word similarity game. The secret word ranks guesses by semantic closeness — #1 means the guess IS the secret word.

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

  // ── Call OpenRouter ──────────────────────────────────────────────────────
  try {
    // Abort if the model takes too long
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 30000);

    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method:  'POST',
      signal:  controller.signal,
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type':  'application/json',
        'HTTP-Referer':  'https://contexto-helper.vercel.app',
        'X-Title':       'Contexto Helper',
      },
      body: JSON.stringify({
        model:       'openrouter/free', // auto-picks best available free model
        messages:    [{ role: 'user', content: prompt }],
        max_tokens:  1000,
        temperature: 0.4,
      }),
    });

    clearTimeout(timeout);

    if (!openRouterRes.ok) {
      const errText = await openRouterRes.text();
      console.error('OpenRouter error:', errText);
      return res.status(502).json({ error: 'AI service error. Try again.' });
    }

    const data = await openRouterRes.json();

    // Some free reasoning models put output in reasoning instead of content
    const message = data.choices?.[0]?.message;
    const raw     = message?.content || message?.reasoning || '';

    // Extract JSON — models sometimes wrap it in extra text
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in model response:', raw);
      return res.status(502).json({ error: 'AI returned an unexpected response. Try again.' });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return res.status(200).json({
      suggestions: parsed.suggestions || [],
      strategy:    parsed.strategy    || '',
    });

  } catch (err) {
    console.error('suggest handler error:', err);

    // Friendly timeout message
    if (err.name === 'AbortError' || err.code === 'UND_ERR_HEADERS_TIMEOUT') {
      return res.status(504).json({ error: 'AI took too long. Try again — free models can be slow.' });
    }

    return res.status(500).json({ error: 'Internal server error.' });
  }
}