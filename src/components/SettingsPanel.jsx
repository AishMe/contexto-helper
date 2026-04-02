// src/components/SettingsPanel.jsx
// Lets users plug in their own API key for better AI suggestions.
// Supports OpenAI, Anthropic, and OpenRouter (paid models).
// The key is stored in localStorage only — never sent to our servers.

import { useState, useEffect } from 'react';

// ── Available providers and their models ─────────────────────────────────────
export const PROVIDERS = [
  {
    id: 'openrouter-free',
    label: 'OpenRouter (Free)',
    placeholder: 'sk-or-v1-...',
    requiresKey: false, // uses server-side key
    models: [
      { id: 'openrouter/free', label: 'Auto (best available free model)' },
    ],
  },
  {
    id: 'openrouter',
    label: 'OpenRouter (Your Key)',
    placeholder: 'sk-or-v1-...',
    requiresKey: true,
    docsUrl: 'https://openrouter.ai/keys',
    models: [
      { id: 'deepseek/deepseek-r1',         label: 'DeepSeek R1 (best reasoning)' },
      { id: 'openai/gpt-4o',                label: 'GPT-4o' },
      { id: 'openai/gpt-4o-mini',           label: 'GPT-4o Mini (fast)' },
      { id: 'anthropic/claude-sonnet-4-6',  label: 'Claude Sonnet 4.6' },
      { id: 'anthropic/claude-haiku-4-5',   label: 'Claude Haiku 4.5 (fast)' },
    ],
  },
  {
    id: 'openai',
    label: 'OpenAI (Your Key)',
    placeholder: 'sk-...',
    requiresKey: true,
    docsUrl: 'https://platform.openai.com/api-keys',
    models: [
      { id: 'gpt-4o',      label: 'GPT-4o (best)' },
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini (fast & cheap)' },
    ],
  },
  {
    id: 'anthropic',
    label: 'Anthropic (Your Key)',
    placeholder: 'sk-ant-...',
    requiresKey: true,
    docsUrl: 'https://console.anthropic.com/keys',
    models: [
      { id: 'claude-sonnet-4-6',         label: 'Claude Sonnet 4.6 (best)' },
      { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 (fast)' },
    ],
  },
];

const STORAGE_KEY = 'contexto_helper_settings';

// ── Helpers to load/save settings from localStorage ──────────────────────────
export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {
      providerId: 'openrouter-free',
      modelId:    'openrouter/free',
      apiKey:     '',
    };
  } catch {
    return { providerId: 'openrouter-free', modelId: 'openrouter/free', apiKey: '' };
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

/**
 * @param {boolean}  isOpen   — whether the panel is visible
 * @param {Function} onClose  — close the panel
 * @param {Function} onChange — called whenever settings change
 */
export default function SettingsPanel({ isOpen, onClose, onChange }) {
  const [settings, setSettings] = useState(loadSettings);
  const [saved,    setSaved]    = useState(false);
  const [showKey,  setShowKey]  = useState(false);

  // Current provider object
  const provider = PROVIDERS.find(p => p.id === settings.providerId) || PROVIDERS[0];

  // When provider changes, reset model to first option
  function handleProviderChange(providerId) {
    const p        = PROVIDERS.find(pr => pr.id === providerId);
    const modelId  = p?.models[0]?.id || '';
    const next     = { ...settings, providerId, modelId, apiKey: '' };
    setSettings(next);
  }

  function handleModelChange(modelId) {
    setSettings(prev => ({ ...prev, modelId }));
  }

  function handleKeyChange(apiKey) {
    setSettings(prev => ({ ...prev, apiKey }));
  }

  function handleSave() {
    saveSettings(settings);
    onChange(settings);   // notify parent so SuggestionsPanel re-reads
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="bg-surface border border-border rounded-xl w-full max-w-md p-6 flex flex-col gap-5"
        onClick={e => e.stopPropagation()} // prevent backdrop click closing when clicking inside
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-text font-semibold text-base">⚙️ Settings</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-text transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Provider selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-subtext text-xs font-medium uppercase tracking-wider">
            AI Provider
          </label>
          <select
            value={settings.providerId}
            onChange={e => handleProviderChange(e.target.value)}
            className="
              bg-bg border border-border rounded-lg px-3 py-2.5
              text-text text-sm focus:outline-none focus:border-accent
              transition-colors
            "
          >
            {PROVIDERS.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Model selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-subtext text-xs font-medium uppercase tracking-wider">
            Model
          </label>
          <select
            value={settings.modelId}
            onChange={e => handleModelChange(e.target.value)}
            className="
              bg-bg border border-border rounded-lg px-3 py-2.5
              text-text text-sm focus:outline-none focus:border-accent
              transition-colors
            "
          >
            {provider.models.map(m => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* API Key input — only shown when provider requires a key */}
        {provider.requiresKey && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-subtext text-xs font-medium uppercase tracking-wider">
                Your API Key
              </label>
              {provider.docsUrl && (
                <a
                  href={provider.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent text-xs hover:underline"
                >
                  Get a key →
                </a>
              )}
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={e => handleKeyChange(e.target.value)}
                placeholder={provider.placeholder}
                autoComplete="off"
                spellCheck={false}
                className="
                  w-full bg-bg border border-border rounded-lg
                  px-3 py-2.5 pr-16 text-text text-sm font-mono
                  focus:outline-none focus:border-accent transition-colors
                "
              />
              {/* Show/hide toggle */}
              <button
                type="button"
                onClick={() => setShowKey(s => !s)}
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  text-muted hover:text-text text-xs transition-colors
                "
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Privacy note */}
            <p className="text-muted text-xs leading-relaxed">
              🔒 Stored in your browser only. Never sent to our servers.
            </p>
          </div>
        )}

        {/* Free tier info */}
        {!provider.requiresKey && (
          <div className="bg-accent/5 border border-accent/20 rounded-lg px-4 py-3 text-xs text-subtext leading-relaxed">
            <span className="text-accent font-semibold block mb-1">Using free tier</span>
            OpenRouter's free models are used — no key needed. For faster and smarter suggestions, switch to a paid provider above.
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          className="
            bg-accent hover:bg-violet-500 text-white font-semibold
            py-2.5 rounded-lg text-sm transition-all active:scale-95
          "
        >
          {saved ? '✅ Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}