# 🟢 Contexto Helper

An AI-powered assistant to help you crack the daily [Contexto](https://contexto.me) word puzzle.
Enter your guesses and their ranks — the AI analyses the semantic pattern and suggests smarter words to try next.

> **Live demo →** [contexto-helper-ml5gbfxke-aishwarya-menons-projects.vercel.app](https://contexto-helper-ml5gbfxke-aishwarya-menons-projects.vercel.app)

---

## 🎮 What is Contexto?

Contexto is a daily word game where you try to guess a secret word. Every guess is ranked by how semantically similar it is to the answer — **#1 means you found it**. The challenge is figuring out which direction to search based on your rankings.

Contexto Helper analyses your guesses and uses AI to suggest the most likely next words to try.

---

## ✨ Features

- **Guess Tracker** — log every word you've tried with its rank
- **Colour-coded ranking** — 🟢 green (top 100), 🟡 yellow (101–500), 🔴 red (500+)
- **AI Suggestions** — analyses your guess patterns and recommends 5 words to try next
- **Strategy Tips** — explains the semantic theme the AI detects in your guesses
- **Bring Your Own Key** — optionally use your own OpenAI or Anthropic API key for better suggestions
- **Persistent guesses** — your session is saved across page refreshes
- **Free to use** — powered by free AI models via OpenRouter

---

## 🛠 Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| AI API | OpenRouter (free tier) |
| Serverless | Vercel Functions |
| Hosting | Vercel (free) |

---

## 🚀 Running Locally

### Prerequisites
- [Node.js](https://nodejs.org) v18+
- A free [OpenRouter](https://openrouter.ai) API key

### 1. Clone the repository

```bash
git clone https://github.com/AishMe/contexto-helper.git
cd contexto-helper
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```
OPENROUTER_API_KEY=your_openrouter_key_here
```

Get a free key (no credit card needed) at → [openrouter.ai/keys](https://openrouter.ai/keys)

### 4. Start the dev server

```bash
npx vercel dev
```

> **Why `vercel dev` instead of `npm run dev`?**
> The AI suggestion feature runs via a Vercel serverless function (`/api/suggest.js`).
> `vercel dev` emulates this locally. Plain `npm run dev` will only serve the UI.

App runs at → **`http://localhost:3000`**

---

## ☁️ Deploying Your Own Instance

### 1. Fork and push to GitHub

Fork this repo, then push your changes to your own GitHub account.

> ⚠️ Never commit `.env.local` — it is already in `.gitignore`.

### 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** and select your forked repo
3. Framework preset: **Vite** (auto-detected)
4. Click **Deploy**

### 3. Add your API key

1. In your Vercel project → **Settings → Environment Variables**
2. Add `OPENROUTER_API_KEY` with your key value
3. Enable for Production, Preview, and Development
4. **Redeploy** the project

---

## 🔑 Using Your Own AI Key (BYOK)

For better suggestions, use your own API key from a premium provider via the in-app Settings panel:

- **OpenAI** — gpt-4o, gpt-4o-mini
- **Anthropic** — claude-haiku-4-5, claude-sonnet-4-6
- **OpenRouter paid models** — any model on OpenRouter

Click the ⚙️ **Settings** icon in the app, paste your key, and choose your provider. Your key is stored only in your browser's localStorage and is never sent to our servers.

---

## 🗂 Project Structure

```
contexto-helper/
├── api/
│   └── suggest.js           ← Vercel serverless function (AI proxy)
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── GuessInput.jsx
│   │   ├── GuessItem.jsx
│   │   ├── GuessList.jsx
│   │   ├── SuggestionsPanel.jsx
│   │   └── SettingsPanel.jsx
│   ├── utils/
│   │   ├── helpers.js       ← colour coding, sorting, localStorage
│   │   └── api.js           ← fetch wrapper for /api/suggest
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── vercel.json
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "add your feature"`
4. Push and open a Pull Request

---

## 📄 License

MIT — free to use, modify, and deploy.