# 🟢 Contexto Helper

An AI-powered assistant for the [Contexto](https://contexto.me) word game.  
Enter your guesses and their ranks — the AI analyses the semantic pattern and suggests what to try next.

---

## ✨ Features

- **Guess Tracker** — add words + ranks, sorted and colour-coded
- **AI Suggestions** — powered by Llama 3.3 via OpenRouter (free)
- **Strategy Tips** — AI explains the semantic pattern it detects
- **Persistent Storage** — guesses survive a page refresh (localStorage)
- **Secure API proxy** — your API key never reaches the browser

---

## 🗂 Project Structure

```
contexto-helper/
├── api/
│   └── suggest.js          ← Vercel serverless function (AI proxy)
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── GuessInput.jsx
│   │   ├── GuessItem.jsx
│   │   ├── GuessList.jsx
│   │   └── SuggestionsPanel.jsx
│   ├── utils/
│   │   ├── helpers.js      ← colour coding, sorting, localStorage
│   │   └── api.js          ← fetch wrapper for /api/suggest
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── .env.local               ← your API key (never committed)
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── vercel.json
```

---

## 🚀 Local Development

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/contexto-helper.git
cd contexto-helper
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your OpenRouter API key

Create a `.env.local` file in the project root:

```
OPENROUTER_API_KEY=your_key_here
```

Get a free key at → [openrouter.ai/keys](https://openrouter.ai/keys)

### 4. Run locally with Vercel Dev

> **Why `vercel dev` instead of `npm run dev`?**  
> The serverless function in `/api/suggest.js` only runs inside Vercel's runtime.  
> `vercel dev` emulates this locally so the AI button works on your machine.

```bash
# Install Vercel CLI (one-time)
npm install -g vercel

# Link your project (one-time)
vercel link

# Start local dev server
vercel dev
```

App runs at → `http://localhost:3000`

---

## ☁️ Deploying to Vercel (Free)

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/contexto-helper.git
git push -u origin main
```

> ⚠️ Make sure `.env.local` is in `.gitignore` — never push your API key.

### Step 2 — Import on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Select your `contexto-helper` repository
4. Framework preset: **Vite** (auto-detected)
5. Click **Deploy**

### Step 3 — Add Environment Variable

1. In your Vercel project → **Settings → Environment Variables**
2. Add:
   - **Name:** `OPENROUTER_API_KEY`
   - **Value:** your OpenRouter key
   - **Environments:** Production, Preview, Development
3. Click **Save**
4. Go to **Deployments** → click the three dots → **Redeploy**

Your app is now live at `https://contexto-helper.vercel.app` 🎉

---

## 🔑 API Key Safety

| Location | Key visible? |
|---|---|
| Browser / client-side code | ❌ Never |
| Vercel Environment Variables | ✅ Server-only |
| `/api/suggest.js` (serverless) | ✅ Runs server-side |
| GitHub repo | ❌ Never (in .gitignore) |

---

## 🔄 Changing the AI Model

In `api/suggest.js`, change the `model` field to any free model on OpenRouter:

```js
model: 'meta-llama/llama-3.3-8b-instruct:free',   // default
// model: 'mistralai/mistral-7b-instruct:free',
// model: 'google/gemma-3-12b-it:free',
```

Browse all free models at → [openrouter.ai/models?q=free](https://openrouter.ai/models?q=free)

---

## 🛠 Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| AI API | OpenRouter (free tier) |
| LLM | Llama 3.3 8B Instruct |
| Serverless | Vercel Functions |
| Hosting | Vercel (free) |
| Persistence | localStorage |

---

## 📄 License

MIT — free to use, modify, and deploy.