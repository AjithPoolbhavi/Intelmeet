# IntellMeet Premium - Enterprise AI Meeting & Collaboration Platform

## 🚀 Overview

IntellMeet Premium is a production-ready, enterprise-grade AI-powered meeting and collaboration platform inspired by Zoom, Microsoft Teams, Google Meet, and Discord. Built with modern tech stack and designed for scalability, security, and exceptional user experience.

## ✨ Premium Features

### Meeting Features
- **Grid & Speaker Views**: Adaptive video layout with intelligent speaker detection
- **HD Video/Audio**: Adaptive bitrate streaming with quality indicators
- **Screen Sharing**: Share screens with multiple participants support
- **Recording**: Native meeting recording with playback
- **Virtual Backgrounds**: AI-powered virtual and blurred backgrounds
- **Waiting Room**: Control participant entry to meetings
- **Breakout Rooms**: Split participants into focused discussion groups
- **Meeting Lock**: Prevent new participants from joining
- **Host Controls**: Mute all, remove participants, record controls

### AI Features
- **Real-time Transcription**: Live speech-to-text with speaker identification
- **AI Meeting Summaries**: Automatic generation of meeting summaries
- **Action Item Extraction**: AI identifies and extracts action items
- **Smart Highlights**: Automatically marks important moments
- **Sentiment Analysis**: Analyzes meeting sentiment and tone
- **Keyword Detection**: Identifies key topics discussed
- **Follow-up Generation**: AI generates follow-up emails and tasks
- **Meeting Insights**: Detailed analytics on participation and engagement

### Collaboration Features
- **Real-time Chat**: Instant messaging with rich media support
- **File Sharing**: Upload and share files during meetings
- **Shared Notes**: Collaborative note-taking during calls
- **Kanban Boards**: Organize tasks and projects in real-time
- **Mentions System**: @mention participants and teams
- **Typing Indicators**: See who's typing in real-time
- **Presence System**: Live online status indicators
- **Reactions & Emojis**: Quick reactions during meetings

### Premium Dashboard
- **Analytics Dashboard**: Comprehensive meeting and productivity statistics
- **Meeting Calendar**: View and manage all upcoming meetings
- **Team Analytics**: Team performance and productivity metrics
- **Activity Feed**: Real-time notification of team activities
- **Meeting History**: Complete meeting records and playback
- **Usage Reports**: Detailed usage statistics and trends
- **Custom Themes**: Dark/light mode with customization options
- **Profile Management**: User preferences and settings

### Workspace Management
- **Multiple Workspaces**: Create and manage multiple team workspaces
- **Role-based Access**: Owner, Admin, Member, Guest roles
- **Workspace Settings**: Control collaboration settings
- **Member Management**: Add/remove members with role assignment
- **Workspace Branding**: Custom workspace appearance

## 📋 Technology Stack

### Frontend
```
React 19 + TypeScript
Vite (build tool)
Tailwind CSS + shadcn/ui
Zustand (state management)
TanStack Query (data fetching)
Socket.IO Client (real-time)
Axios (HTTP client)
Lucide React (icons)
React Router (routing)
```

### Backend
```
Node.js + Express
MongoDB + Mongoose
Socket.IO (WebRTC signaling)
JWT Authentication
OpenAI Integration
Nodemon (dev server)
CORS middleware
```

### DevOps
```
Docker & Docker Compose
Nginx reverse proxy
GitHub Actions (CI/CD)
Environment-based configuration
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB 5.0+
- npm or yarn
- Git

### Clone Repository
\`\`\`bash
git clone https://github.com/yourusername/intellmeet.git
cd intellmeet
\`\`\`

### Environment Setup

#### Client (.env)
\`\`\`env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_OPENAI_API_KEY=your_openai_key
\`\`\`

#### Server (.env)
\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/intellmeet
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_key
NODE_ENV=development
\`\`\`

### Installation Steps

#### 1. Install Client Dependencies
\`\`\`bash
cd client
npm install
\`\`\`

#### 2. Install Server Dependencies
\`\`\`bash
cd ../server
npm install
\`\`\`

#### 3. Start MongoDB
\`\`\`bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Or local MongoDB
mongod
\`\`\`

#### 4. Start Development Servers

Client:
\`\`\`bash
cd client
npm run dev
# Runs on http://localhost:5173
\`\`\`

Server (in new terminal):
\`\`\`bash
cd server
npm run dev
# Runs on http://localhost:5000
\`\`\`

## 📁 Project Structure

```
intellmeet/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/       # Dashboard components
│   │   │   ├── meeting/         # Meeting room components
│   │   │   ├── ui/              # Reusable UI components
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── FormInputs.tsx
│   │   │   │   ├── Tabs.tsx
│   │   │   │   └── Stats.tsx
│   │   │   └── ...
│   │   ├── pages/               # Page components
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # API services
│   │   ├── store/               # Zustand stores
│   │   ├── types/               # TypeScript types
│   │   ├── utils/               # Helper utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── controllers/             # Route controllers
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js
│   │   ├── Meeting.js
│   │   ├── Task.js
│   │   ├── Workspace.js
│   │   ├── Notification.js
│   │   └── Analytics.js
│   ├── routes/                  # API routes
│   │   ├── auth.js
│   │   ├── meetings.js
│   │   ├── ai.js
│   │   ├── tasks.js
│   │   ├── workspaces.js
│   │   ├── notifications.js
│   │   └── analytics.js
│   ├── middleware/              # Express middleware
│   ├── sockets/                 # Socket.IO handlers
│   ├── utils/                   # Helper utilities
│   ├── index.js
│   └── package.json
│
└── docker-compose.yml
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Meetings
- `POST /api/meetings/create` - Create meeting
- `GET /api/meetings/:id` - Get meeting details
- `GET /api/meetings/user/:userId` - Get user's meetings
- `PUT /api/meetings/:id/end` - End meeting
- `PUT /api/meetings/:id/summary` - Save AI summary

### AI Features
- `POST /api/ai/summary` - Generate meeting summary
- `POST /api/ai/transcript` - Get transcription
- `POST /api/ai/insights` - Get meeting insights

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Workspaces
- `GET /api/workspaces` - Get user's workspaces
- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces/:id` - Get workspace details
- `POST /api/workspaces/:id/members` - Add member
- `DELETE /api/workspaces/:id/members/:userId` - Remove member

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

### Analytics
- `GET /api/analytics/dashboard` - Get analytics dashboard
- `GET /api/analytics/meeting/:meetingId` - Get meeting analytics
- `GET /api/analytics/insights/productivity` - Get productivity insights

## 🎯 Key Components

### Premium UI Components
- `Card`: Flexible card component with glass morphism
- `Modal`: Customizable modal dialogs
- `FormInputs`: Text, textarea, select, checkbox, radio components
- `Tabs`: Tab navigation system
- `Dropdown`: Context menus and dropdowns
- `StatCard`: Statistics display cards
- `ChartPlaceholder`: Analytics visualization placeholders
- `PremiumBadge`: Status badges with variants

### Premium Meeting Components
- `PremiumControlBar`: Advanced meeting controls
- `MeetingHeader`: Meeting info and timer
- `PremiumVideoTile`: Enhanced video tile with indicators
- `VideoGrid`: Responsive video grid layout

### Premium Dashboard
- `PremiumDashboard`: Main analytics and management dashboard
- Complete with stats, charts, and quick actions

## 🔐 Security Features

- JWT-based authentication
- CORS configuration
- Password hashing with bcryptjs
- Secure session management
- Input validation
- Rate limiting ready
- HTTPS support
- Environment-based secrets

## 📊 Database Schema

### Users
- id, name, email, password, avatar, timezone, preferences, createdAt

### Meetings
- id, title, host, participants, messages, recording, summary, actionItems, status, createdAt

### Tasks
- id, title, description, status, priority, owner, assignee, dueDate, createdAt

### Workspaces
- id, name, owner, members, settings, createdAt

### Notifications
- id, userId, title, message, type, read, createdAt

### Analytics
- id, userId, type, action, metadata, timestamp

## 🚀 Deployment

### Docker Deployment

\`\`\`bash
docker-compose up -d
\`\`\`

### Environment Variables
Set these in your deployment platform:
- DATABASE_URL
- JWT_SECRET
- OPENAI_API_KEY
- CLIENT_URL
- CORS_ORIGIN

### Production Checklist
- [ ] Enable HTTPS
- [ ] Set secure JWT secret
- [ ] Configure MongoDB production instance
- [ ] Enable rate limiting
- [ ] Set up logging
- [ ] Configure monitoring
- [ ] Enable backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Configure CDN for static assets
- [ ] Set up error tracking (Sentry)

## 🔄 Development Workflow

### Running Tests
\`\`\`bash
npm run test
\`\`\`

### Building for Production
\`\`\`bash
# Client
cd client
npm run build

# Server
cd ../server
npm start
\`\`\`

### Code Quality
\`\`\`bash
# Linting
npm run lint

# Format
npm run format
\`\`\`

## 📚 Documentation

- [API Documentation](./API.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [User Guide](./USER_GUIDE.md)

## 🤝 Contributing

1. Create feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

- Documentation: [docs.intellmeet.io](https://docs.intellmeet.io)
- Email: support@intellmeet.io
- Issues: [GitHub Issues](https://github.com/intellmeet/intellmeet/issues)

## 🎉 Built With

- React 19
- Node.js
- MongoDB
- Socket.IO
- Tailwind CSS
- TypeScript
- And more amazing libraries!

---

**IntellMeet Premium** - The Future of Enterprise Collaboration 🚀
