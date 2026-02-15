# ✨ ForgeWrite

ForgeWrite is an AI-powered prompt engineering web app that transforms vague ideas into structured, high-quality prompts ready for use with modern LLMs.

Built with a modern full-stack architecture using **FastAPI + Next.js**, ForgeWrite focuses on clean UX, structured outputs, and secure AI integration.

---

## 🚀 Features

* 🧠 Converts vague inputs into structured prompts
* 🎯 Persona and domain-aware prompt generation
* 📜 Prompt history with local persistence
* 📋 One-click copy support
* 📥 Download prompts as `.txt`
* 🌙 Dark / Light mode
* 🧭 Expandable prompt viewer modal
* ✨ Interactive animated UI
* 🔐 Secure backend AI calls (no API key exposure)

---

## 🧱 Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Lucide Icons
* Canvas-based animated background

### Backend

* FastAPI
* Gemini API (LLM generation)
* Pydantic schema validation
* REST architecture

### Deployment

* Frontend → Vercel
* Backend → Render
* Environment variables for secrets

---

## 📂 Project Structure

```
ForgeWrite/
├── backend/
│   ├── main.py
│   ├── schemas/
│   ├── services/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── styles/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Local Development

### 1️⃣ Clone repository

```bash
git clone https://github.com/yourusername/ForgeWrite.git
cd ForgeWrite
```

---

## 🧠 Backend Setup (FastAPI)

### Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Create `.env`

```
GEMINI_API_KEY=your_api_key_here
```

### Run backend

```bash
uvicorn main:app --reload
```

Runs on:

```
http://127.0.0.1:8000
```

---

## 🎨 Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```
http://localhost:3000
```

---

## 🔐 Environment Variables

| Variable         | Description                |
| ---------------- | -------------------------- |
| `GEMINI_API_KEY` | LLM API key (backend only) |

Never expose API keys in frontend code.

---

## 🌍 Deployment

### Backend → Render

1. Create a new Web Service
2. Build command:

   ```
   pip install -r requirements.txt
   ```
3. Start command:

   ```
   uvicorn main:app --host 0.0.0.0 --port 10000
   ```
4. Add environment variable:

   ```
   GEMINI_API_KEY=your_key
   ```

---

### Frontend → Vercel

1. Import repository
2. Select `/frontend` as root
3. Deploy

Update API URL in frontend:

```ts
fetch("https://your-backend-url/generate")
```

---

## 🛡️ Security Model

ForgeWrite keeps API keys safe using:

* Server-side LLM calls
* Environment variable isolation
* No direct frontend AI access
* Optional CORS restriction

---

## 📌 Roadmap

* [ ] Prompt templates library
* [ ] User accounts
* [ ] Saved prompts dashboard
* [ ] Prompt scoring system
* [ ] Streaming responses
* [ ] Plugin ecosystem

---

## 🤝 Contributing

Contributions are welcome.

Steps:

1. Fork repository
2. Create feature branch
3. Submit pull request

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

⭐ Star the repository if you found it useful.

---

Created by @pranav.ggez on GitHub
