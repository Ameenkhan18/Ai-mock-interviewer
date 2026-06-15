# AI Mock Interviewer

Practice job interviews with an AI interviewer. Pick a role and difficulty, answer realistic
AI-generated questions, and receive instant feedback on clarity, relevance, and depth.
All sessions are saved to MongoDB so you can track progress over time.

## Live Demo

- **Frontend (Vercel):** https://ai-mock-interviewer-iota-mocha.vercel.app/
- **Backend (Render):** https://ai-mock-interviewer-jtpn.onrender.com

### Deployment Status

The backend is live on Render and connected to MongoDB Atlas:

![Render deployment logs](./screenshots/render-deploy-success.png)

```
Server running on port 5000
MongoDB connected: ac-iwjumgw-shard-00-02.xwnnvou.mongodb.net
==> Your service is live 🎉
==> Available at your primary URL https://ai-mock-interviewer-jtpn.onrender.com
```

> Note: Render's free tier spins down after periods of inactivity, so the first request after idle time may take 30-50 seconds to respond.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS, deployed on Vercel
- **Backend:** Node.js + Express, deployed on Render
- **AI:** OpenAI API (chat completions)
- **Database:** MongoDB (Atlas)

## Project Structure

```
ai-mock-interviewer/
├── client/   # React frontend
└── server/   # Express backend
```

## Local Setup

### 1. Backend

```bash
cd server
cp .env.example .env
# Fill in MONGO_URI, OPENAI_API_KEY, CLIENT_URL
npm install
npm run dev
```

Server runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd client
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

App runs on `http://localhost:5173`.

## Deployment

### Backend → Render

1. Push this repo to GitHub.
2. On Render, create a **New Web Service**, connect the repo, set root directory to `server`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables: `MONGO_URI`, `OPENAI_API_KEY`, `CLIENT_URL` (your Vercel URL), `PORT` (Render sets this automatically).

### Frontend → Vercel

1. Import the repo on Vercel.
2. Set root directory to `client`.
3. Framework preset: Vite.
4. Add environment variable: `VITE_API_URL` = `https://<your-render-app>.onrender.com/api`
5. Deploy.

### MongoDB → Atlas

1. Create a free cluster at mongodb.com/atlas.
2. Create a database user, whitelist `0.0.0.0/0` (or Render's IPs) for network access.
3. Copy the connection string into `MONGO_URI`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/interview/start` | Start a new interview session |
| POST | `/api/interview/:sessionId/answer` | Submit an answer, get AI feedback |
| GET | `/api/interview/:sessionId` | Get a single session |
| GET | `/api/interview/history/:userId` | Get all sessions for a user |
| DELETE | `/api/interview/:sessionId` | Delete a session |

## License

MIT
