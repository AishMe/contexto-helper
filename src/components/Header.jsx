// src/components/Header.jsx
// Top navigation bar — logo + subtitle, mirrors Contexto's minimal header.

export default function Header() {
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

      {/* Subtitle / tagline */}
      <p className="text-subtext text-xs hidden sm:block">
        AI-powered word assistant
      </p>
    </header>
  );
}