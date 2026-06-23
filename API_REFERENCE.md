## IntellMeet Premium - Complete API Reference

### Base URL
\`\`\`
http://localhost:5000/api
\`\`\`

## Authentication

### Login
\`\`\`
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
\`\`\`

### Register
\`\`\`
POST /auth/register
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token",
  "user": { ... }
}
\`\`\`

### Get Current User
\`\`\`
GET /auth/me
Authorization: Bearer {token}

Response:
{
  "id": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "preferences": { ... }
}
\`\`\`

## Meetings

### Create Meeting
\`\`\`
POST /meetings/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Team Standup",
  "tags": ["standup", "team"]
}

Response:
{
  "_id": "meeting_id",
  "meetingId": "unique_code",
  "title": "Team Standup",
  "status": "active"
}
\`\`\`

### Get Meeting Details
\`\`\`
GET /meetings/{meetingId}
Authorization: Bearer {token}

Response:
{
  "_id": "meeting_id",
  "title": "Team Standup",
  "host": { ... },
  "participants": [ ... ],
  "messages": [ ... ],
  "status": "active"
}
\`\`\`

### Get User's Meetings
\`\`\`
GET /meetings/user/{userId}
Authorization: Bearer {token}

Query Parameters:
- limit: 20
- skip: 0

Response:
[
  {
    "_id": "meeting_id",
    "title": "Meeting Title",
    ...
  }
]
\`\`\`

### End Meeting
\`\`\`
PUT /meetings/{meetingId}/end
Authorization: Bearer {token}

Response:
{
  "status": "ended",
  "endedAt": "timestamp"
}
\`\`\`

### Save Meeting Summary
\`\`\`
PUT /meetings/{meetingId}/summary
Authorization: Bearer {token}
Content-Type: application/json

{
  "summary": "Meeting summary text",
  "actionItems": ["Item 1", "Item 2"]
}

Response:
{
  "summary": "Meeting summary",
  "actionItems": [ ... ]
}
\`\`\`

## AI Features

### Generate Summary
\`\`\`
POST /ai/summary
Authorization: Bearer {token}
Content-Type: application/json

{
  "meetingTitle": "Q1 Planning",
  "duration": 3600,
  "participantCount": 8,
  "chatMessages": [ "message1", "message2" ]
}

Response:
{
  "summary": "Meeting covered Q1 planning objectives...",
  "actionItems": [ ... ],
  "keywords": [ ... ],
  "model": "gpt-4",
  "confidence": "high"
}
\`\`\`

### Get Transcription
\`\`\`
GET /ai/transcript/{meetingId}
Authorization: Bearer {token}

Response:
{
  "meetingId": "meeting_id",
  "transcript": [
    {
      "speaker": "John Doe",
      "text": "Hello everyone...",
      "timestamp": 0,
      "confidence": 0.95
    }
  ]
}
\`\`\`

### Get Meeting Insights
\`\`\`
GET /ai/insights/{meetingId}
Authorization: Bearer {token}

Response:
{
  "sentiment": {
    "overall": "positive",
    "byParticipant": { ... }
  },
  "highlights": [ ... ],
  "topics": [ ... ],
  "speakerStats": [ ... ]
}
\`\`\`

## Tasks

### Get All Tasks
\`\`\`
GET /tasks
Authorization: Bearer {token}

Query Parameters:
- status: todo|inprogress|done
- priority: low|medium|high
- limit: 20

Response:
[
  {
    "_id": "task_id",
    "title": "Task Title",
    "status": "todo",
    "priority": "high"
  }
]
\`\`\`

### Create Task
\`\`\`
POST /tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "priority": "high",
  "dueDate": "2024-12-31"
}

Response:
{
  "_id": "task_id",
  "title": "New Task",
  ...
}
\`\`\`

### Update Task
\`\`\`
PUT /tasks/{taskId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "inprogress",
  "priority": "medium"
}

Response:
{
  "_id": "task_id",
  "status": "inprogress",
  ...
}
\`\`\`

### Delete Task
\`\`\`
DELETE /tasks/{taskId}
Authorization: Bearer {token}

Response:
{
  "message": "Task deleted"
}
\`\`\`

## Workspaces

### Get Workspaces
\`\`\`
GET /workspaces
Authorization: Bearer {token}

Response:
[
  {
    "_id": "workspace_id",
    "name": "Engineering Team",
    "owner": "user_id",
    "members": [ ... ]
  }
]
\`\`\`

### Create Workspace
\`\`\`
POST /workspaces
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Engineering Team",
  "description": "Main engineering team workspace"
}

Response:
{
  "_id": "workspace_id",
  "name": "Engineering Team",
  ...
}
\`\`\`

### Add Workspace Member
\`\`\`
POST /workspaces/{workspaceId}/members
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id",
  "role": "member"
}

Response:
{
  "members": [ ... ]
}
\`\`\`

### Update Workspace Settings
\`\`\`
PUT /workspaces/{workspaceId}/settings
Authorization: Bearer {token}
Content-Type: application/json

{
  "isPublic": true,
  "allowMemberInvite": true
}

Response:
{
  "settings": { ... }
}
\`\`\`

## Notifications

### Get Notifications
\`\`\`
GET /notifications
Authorization: Bearer {token}

Query Parameters:
- limit: 20
- skip: 0
- unreadOnly: false

Response:
{
  "notifications": [ ... ],
  "total": 150,
  "unreadCount": 5
}
\`\`\`

### Mark as Read
\`\`\`
PUT /notifications/{notificationId}/read
Authorization: Bearer {token}

Response:
{
  "_id": "notification_id",
  "read": true
}
\`\`\`

### Mark All as Read
\`\`\`
PUT /notifications/all/read
Authorization: Bearer {token}

Response:
{
  "message": "All notifications marked as read"
}
\`\`\`

### Delete Notification
\`\`\`
DELETE /notifications/{notificationId}
Authorization: Bearer {token}

Response:
{
  "message": "Notification deleted"
}
\`\`\`

## Analytics

### Get Dashboard Analytics
\`\`\`
GET /analytics/dashboard
Authorization: Bearer {token}

Query Parameters:
- days: 30

Response:
{
  "totalMeetings": 45,
  "totalDuration": 2400,
  "averageParticipants": 8,
  "totalEvents": 450,
  "meetingTrend": [ ... ],
  "hourStats": [ ... ],
  "productivityScore": 87
}
\`\`\`

### Get Meeting Analytics
\`\`\`
GET /analytics/meeting/{meetingId}
Authorization: Bearer {token}

Response:
{
  "events": [ ... ],
  "participants": 12,
  "messageCount": 45,
  "avgSessionDuration": 42
}
\`\`\`

### Get Productivity Insights
\`\`\`
GET /analytics/insights/productivity
Authorization: Bearer {token}

Query Parameters:
- days: 7

Response:
{
  "score": 87,
  "meetings": 8,
  "tasks": 12,
  "messages": 150,
  "trend": "up"
}
\`\`\`

## WebSocket Events

### Connection
\`\`\`
socket.emit('join-meeting', {
  meetingId: 'meeting_id',
  userId: 'user_id',
  userName: 'User Name'
})
\`\`\`

### Receive Messages
\`\`\`
socket.on('message', {
  id: 'msg_id',
  senderId: 'user_id',
  senderName: 'User Name',
  content: 'Message content',
  timestamp: 'datetime'
})
\`\`\`

### Send Message
\`\`\`
socket.emit('send-message', {
  meetingId: 'meeting_id',
  content: 'Message content'
})
\`\`\`

### Participant Status
\`\`\`
socket.on('participant-status', {
  userId: 'user_id',
  status: 'speaking|idle|disconnected'
})
\`\`\`

### Disconnect
\`\`\`
socket.emit('leave-meeting', {
  meetingId: 'meeting_id'
})
\`\`\`

## Error Responses

### 400 Bad Request
\`\`\`
{
  "error": "Invalid request parameters",
  "details": [ ... ]
}
\`\`\`

### 401 Unauthorized
\`\`\`
{
  "error": "Invalid or expired token"
}
\`\`\`

### 403 Forbidden
\`\`\`
{
  "error": "Access denied"
}
\`\`\`

### 404 Not Found
\`\`\`
{
  "error": "Resource not found"
}
\`\`\`

### 500 Server Error
\`\`\`
{
  "error": "Internal server error",
  "message": "Error details"
}
\`\`\`

## Rate Limiting

All endpoints are rate-limited to:
- **Authenticated users**: 100 requests per minute
- **Anonymous users**: 20 requests per minute

Headers:
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
\`\`\`

---

For more details, visit: https://api.intellmeet.io/docs
