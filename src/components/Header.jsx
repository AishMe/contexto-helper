// src/components/Header.jsx
// Top navigation bar — mobile friendly with settings button.

export default function Header({ onSettingsClick }) {
  return (
    <header className="
      w-full border-b border-border
      flex items-center justify-between
      px-3 sm:px-6 py-3 sm:py-4
    ">
      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green"  />
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow" />
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red"    />
        </div>
        <h1 className="text-text font-bold text-base sm:text-lg tracking-tight">
          Contexto <span className="text-accent">Helper</span>
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">
        <p className="text-subtext text-xs hidden sm:block">AI-powered word assistant</p>
        <button
          onClick={onSettingsClick}
          title="Settings"
          className="
            text-muted hover:text-text transition-colors
            text-base sm:text-lg leading-none p-1.5 rounded-lg
            hover:bg-surface
          "
        >
          ⚙️
        </button>
      </div>
    </header>
  );
}