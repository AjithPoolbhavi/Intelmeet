# 🎥 IntellMeet — AI-Powered Enterprise Video Platform

A full-stack MERN application inspired by Zoom, featuring real-time video meetings, AI-generated summaries, team collaboration, and a Kanban task board.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas) — *optional, app runs in mock mode without it*

### 1. Clone & Setup

```bash
# Install all dependencies
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env with your values:
# MONGODB_URI=mongodb://localhost:27017/intellmeet
# JWT_SECRET=your_secret_here
# CLIENT_URL=http://localhost:5173
```

### 3. Run

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App opens at http://localhost:5173
```

---

## 📁 Project Structure

```
intellmeet/
├── server/
│   ├── controllers/      # Business logic
│   │   ├── authController.js
│   │   ├── meetingController.js
│   │   ├── aiController.js
│   │   └── taskController.js
│   ├── models/           # MongoDB schemas
│   │   ├── User.js
│   │   ├── Meeting.js
│   │   └── Task.js
│   ├── routes/           # Express routes
│   ├── middleware/       # JWT auth middleware
│   ├── sockets/          # Socket.io handlers
│   └── index.js          # Server entry
│
└── client/
    └── src/
        ├── pages/        # Route pages
        ├── components/
        │   ├── ui/       # Shared UI (Sidebar, Logo, Skeleton)
        │   └── meeting/  # Meeting-specific components
        ├── hooks/        # useWebRTC
        ├── store/        # Zustand stores
        ├── services/     # API + Socket clients
        └── types/        # TypeScript interfaces
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/meetings/create` | Create meeting |
| GET | `/api/meetings/:id` | Get meeting by ID |
| GET | `/api/meetings/user/:userId` | Get user meetings |
| PUT | `/api/meetings/:id/end` | End meeting |
| PUT | `/api/meetings/:id/summary` | Save AI summary |
| POST | `/api/ai/summary` | Generate AI summary |
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

---

## 🔌 Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-room` | Client→Server | Join a meeting room |
| `room-participants` | Server→Client | Current room participants |
| `user-joined` | Server→Client | Someone joined |
| `user-left` | Server→Client | Someone left |
| `offer/answer/ice-candidate` | Bilateral | WebRTC signaling |
| `send-message` | Client→Server | Chat message |
| `receive-message` | Server→Client | Broadcast chat |
| `media-state` | Client→Server | Audio/video toggle |
| `screen-share-started/stopped` | Client→Server | Screen sharing |

---

## ✨ Features

- **🔐 Auth** — JWT + bcrypt, protected routes
- **🎥 Video Meetings** — WebRTC peer-to-peer, mute/camera toggle
- **💬 Real-time Chat** — Socket.io in-meeting messaging
- **👥 Participants** — Live list with media state indicators
- **🤖 AI Summary** — Mock AI endpoint with realistic summaries
- **✅ Action Items** — Extract and save to Kanban board
- **📋 Task Board** — Drag-and-drop Kanban (To Do / In Progress / Done)
- **📊 Dashboard** — Meeting history, stats, quick join
- **🌑 Dark Theme** — Zoom-inspired dark UI

---

## 🔑 Mock Mode

If MongoDB is not running, the app automatically falls back to **in-memory mock mode** — all features work, but data resets on server restart.

---

## 🛠️ Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Zustand, Socket.io-client  
**Backend:** Node.js, Express, MongoDB/Mongoose, JWT, Socket.io, WebRTC (via browser APIs)
