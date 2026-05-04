const jwt = require('jsonwebtoken');

// rooms: Map<meetingId, Set<socketId>>
// participants: Map<socketId, {userId, name, meetingId}>
const rooms = new Map();
const participants = new Map();

module.exports = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'intellmeet_secret');
        socket.userId = decoded.id;
      } catch (e) {
        socket.userId = 'guest_' + socket.id.substring(0, 6);
      }
    } else {
      socket.userId = 'guest_' + socket.id.substring(0, 6);
    }
    next();
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join meeting room
    socket.on('join-room', ({ meetingId, userName }) => {
      socket.join(meetingId);

      if (!rooms.has(meetingId)) rooms.set(meetingId, new Set());
      rooms.get(meetingId).add(socket.id);

      participants.set(socket.id, { userId: socket.userId, name: userName, meetingId });

      // Get all participants in room
      const roomParticipants = getRoomParticipants(meetingId);

      // Notify others
      socket.to(meetingId).emit('user-joined', {
        socketId: socket.id,
        userId: socket.userId,
        name: userName,
        participants: roomParticipants,
      });

      // Send current participants to the new joiner
      socket.emit('room-participants', { participants: roomParticipants });

      console.log(`${userName} joined room ${meetingId}`);
    });

    // WebRTC signaling
    socket.on('offer', ({ targetId, offer, fromName }) => {
      io.to(targetId).emit('offer', { fromId: socket.id, offer, fromName });
    });

    socket.on('answer', ({ targetId, answer }) => {
      io.to(targetId).emit('answer', { fromId: socket.id, answer });
    });

    socket.on('ice-candidate', ({ targetId, candidate }) => {
      io.to(targetId).emit('ice-candidate', { fromId: socket.id, candidate });
    });

    // Chat messages
    socket.on('send-message', ({ meetingId, content, senderName }) => {
      const message = {
        id: Date.now().toString(),
        senderId: socket.userId,
        senderName,
        content,
        timestamp: new Date().toISOString(),
      };
      io.to(meetingId).emit('receive-message', message);
    });

    // Media state changes
    socket.on('media-state', ({ meetingId, audio, video }) => {
      socket.to(meetingId).emit('participant-media-state', {
        socketId: socket.id,
        audio,
        video,
      });
    });

    // Screen share
    socket.on('screen-share-started', ({ meetingId }) => {
      socket.to(meetingId).emit('participant-screen-share', {
        socketId: socket.id,
        sharing: true,
      });
    });

    socket.on('screen-share-stopped', ({ meetingId }) => {
      socket.to(meetingId).emit('participant-screen-share', {
        socketId: socket.id,
        sharing: false,
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      const participant = participants.get(socket.id);
      if (participant) {
        const { meetingId, name } = participant;
        if (rooms.has(meetingId)) {
          rooms.get(meetingId).delete(socket.id);
          if (rooms.get(meetingId).size === 0) rooms.delete(meetingId);
        }
        participants.delete(socket.id);

        io.to(meetingId).emit('user-left', {
          socketId: socket.id,
          name,
          participants: getRoomParticipants(meetingId),
        });

        console.log(`${name} left room ${meetingId}`);
      }
    });

    socket.on('leave-room', ({ meetingId }) => {
      const participant = participants.get(socket.id);
      socket.leave(meetingId);
      if (rooms.has(meetingId)) {
        rooms.get(meetingId).delete(socket.id);
      }
      participants.delete(socket.id);

      io.to(meetingId).emit('user-left', {
        socketId: socket.id,
        name: participant?.name || 'Unknown',
        participants: getRoomParticipants(meetingId),
      });
    });
  });

  function getRoomParticipants(meetingId) {
    const room = rooms.get(meetingId);
    if (!room) return [];
    return Array.from(room).map(socketId => ({
      socketId,
      ...participants.get(socketId),
    })).filter(Boolean);
  }
};
