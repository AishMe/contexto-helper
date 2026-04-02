// src/components/Header.jsx
// Top navigation bar — logo + settings gear icon.

/**
 * @param {Function} onSettingsClick — opens the settings panel
 */
export default function Header({ onSettingsClick }) {
  return (
    <header className="
      w-full border-b border-border
      flex items-center justify-between
      px-6 py-4
    ">
      {/* Logo area */}
      <div className="flex items-center gap-3">
        {/* Coloured dot trio — visual nod to Contexto's rank colours */}
        <div className="flex gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-green"  />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow" />
          <span className="w-2.5 h-2.5 rounded-full bg-red"    />
        </div>
        <h1 className="text-text font-bold text-lg tracking-tight">
          Contexto <span className="text-accent">Helper</span>
        </h1>
      </div>

      {/* Right side: tagline + settings button */}
      <div className="flex items-center gap-4">
        <p className="text-subtext text-xs hidden sm:block">
          AI-powered word assistant
        </p>

        {/* Settings gear button */}
        <button
          onClick={onSettingsClick}
          title="Settings — change AI provider or add your own key"
          className="
            text-muted hover:text-text transition-colors
            text-lg leading-none p-1 rounded-lg
            hover:bg-surface
          "
        >
          ⚙️
        </button>
      </div>
    </header>
  );
}