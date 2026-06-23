# IntellMeet Premium - 5-Minute Quick Start

## ⚡ Get Running in 5 Minutes

This is the fastest way to get IntellMeet Premium up and running locally.

---

## 📋 Prerequisites (Already Have?)

- ✅ Node.js 18+ installed
- ✅ MongoDB running (or MongoDB Atlas account)
- ✅ OpenAI API key

**Don't have MongoDB?**
```bash
# Quick Docker setup (if Docker installed):
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

## 🚀 Quick Setup

### Step 1: Clone & Navigate (1 minute)
```bash
git clone https://github.com/yourusername/intellmeet.git
cd intellmeet
```

### Step 2: Configure Environment (1 minute)

**Create `server/.env`:**
```env
MONGODB_URI=mongodb://localhost:27017/intellmeet
JWT_SECRET=your_secret_key_change_this
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=sk-your_key_here
```

**Create `client/.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Step 3: Install Dependencies (2 minutes)

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm run dev
# Should show: Server running on port 5000 ✅
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
# Should show: VITE v5.4.21 ready in 100ms ✅
```

### Step 4: Open in Browser (1 minute)

Visit: **http://localhost:5173**

---

## ✨ What You Can Do Immediately

✅ **Dashboard** - View analytics and stats  
✅ **Start Meeting** - Create new video meetings  
✅ **Join Meeting** - Enter existing meetings  
✅ **Chat** - Send real-time messages  
✅ **Task Board** - Manage kanban tasks  
✅ **Dark Mode** - Toggle theme in settings  

---

## 🐛 Quick Troubleshooting

### "Cannot find module" Error
```bash
# Clear and reinstall
cd server
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Failed
```bash
# Start MongoDB
mongod
# Or use Docker:
docker start mongodb
```

### Still Having Issues?
See [TROUBLESHOOTING_FAQ.md](TROUBLESHOOTING_FAQ.md) for detailed solutions.

---

## 📚 Next Steps

### After Getting Running:

1. **Explore Code**: Check `client/src/` and `server/routes/`
2. **Read Architecture**: See [ARCHITECTURE_GUIDE.md](ARCHITECTURE_GUIDE.md)
3. **API Documentation**: Check [API_REFERENCE.md](API_REFERENCE.md)
4. **Create Features**: Follow component patterns in `client/src/components/`
5. **Deploy**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### Useful Links:

- 📖 **Setup Guide**: [QUICK_START.md](QUICK_START.md)
- 🏗️ **Architecture**: [ARCHITECTURE_GUIDE.md](ARCHITECTURE_GUIDE.md)
- 📡 **API Docs**: [API_REFERENCE.md](API_REFERENCE.md)
- 🚀 **Deployment**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- ❓ **FAQ**: [TROUBLESHOOTING_FAQ.md](TROUBLESHOOTING_FAQ.md)
- 📋 **All Docs**: [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

---

## 💡 Quick Tips

### Develop Faster:
- Use React DevTools browser extension
- Enable hot module replacement (automatic)
- Check TypeScript errors in IDE
- Use `npm run lint` to catch issues early

### Common Tasks:
- **Add new API endpoint**: Create file in `server/routes/`
- **Add new component**: Create file in `client/src/components/`
- **Add new type**: Update `client/src/types/index.ts`
- **Add new database model**: Create file in `server/models/`

### Environment Variables:
```bash
# Server - Change these in production:
MONGODB_URI         # Database connection
JWT_SECRET          # Keep secret!
OPENAI_API_KEY      # For AI features
NODE_ENV            # 'development' or 'production'

# Client - Point to your server:
VITE_API_URL        # Backend URL
VITE_SOCKET_URL     # WebSocket URL
```

---

## ✅ Verification Checklist

After starting, verify these work:

- [ ] Frontend loads at http://localhost:5173
- [ ] Backend responds at http://localhost:5000
- [ ] No red errors in console (F12)
- [ ] Database connected (check server logs)
- [ ] Can see dashboard
- [ ] Dark mode toggle works
- [ ] No CORS errors
- [ ] WebSocket connected (DevTools → Network → WS)

---

## 🎯 Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build

# Utilities
npm run lint         # Check code quality
npm test            # Run tests (when available)

# Cleanup
npm cache clean --force
rm -rf node_modules
npm install

# Docker (if using containers)
docker-compose up   # Start all services
docker-compose down # Stop all services
```

---

## 🔧 Tech Stack at a Glance

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript + Vite |
| **Styling** | Tailwind CSS |
| **State** | Zustand |
| **Real-time** | Socket.IO |
| **Backend** | Node.js + Express |
| **Database** | MongoDB |
| **Auth** | JWT |
| **AI** | OpenAI API |

---

## 📞 Need Help?

- **Setup Issues?** → See [TROUBLESHOOTING_FAQ.md](TROUBLESHOOTING_FAQ.md)
- **Want Details?** → See [QUICK_START.md](QUICK_START.md)
- **Understand Design?** → See [ARCHITECTURE_GUIDE.md](ARCHITECTURE_GUIDE.md)
- **Use APIs?** → See [API_REFERENCE.md](API_REFERENCE.md)
- **Go Live?** → See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 🎉 Ready?

```bash
# Get started now:
git clone https://github.com/yourusername/intellmeet.git
cd intellmeet
# Follow steps above!
```

**Happy coding! 🚀**

---

**Last Updated**: 2026-05-11  
**Version**: 1.0.0 Premium  
**Status**: Production Ready ✅
