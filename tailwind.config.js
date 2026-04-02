// tailwind.config.js
// Scans all JSX/JS files in src/ for class names
// Extends theme with custom Contexto-style colors and fonts

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Custom color palette inspired by Contexto's dark UI
      colors: {
        bg:        '#0f0f0f',
        surface:   '#1a1a1a',
        border:    '#2a2a2a',
        muted:     '#555555',
        text:      '#e8e8e8',
        subtext:   '#888888',
        green:     '#4ade80',
        yellow:    '#facc15',
        red:       '#f87171',
        accent:    '#7c3aed',
      },
      fontFamily: {
        // Clean, modern sans-serif matching Contexto's minimal look
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};