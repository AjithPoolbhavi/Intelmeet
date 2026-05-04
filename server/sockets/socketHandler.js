const Meeting = require('../models/Meeting');

const rooms = new Map(); // roomId -> Map(socketId -> {userId, name, avatar})

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join meeting room
    socket.on('join-room', async ({ meetingId, userId, userName, userAvatar }) => {
      socket.join(meetingId);

      if (!rooms.has(meetingId)) rooms.set(meetingId, new Map());
      rooms.get(meetingId).set(socket.id, { userId, name: userName, avatar: userAvatar, socketId: socket.id });

      const participants = Array.from(rooms.get(meetingId).values());

      // Notify others
      socket.to(meetingId).emit('user-joined', { socketId: socket.id, userId, name: userName, avatar: userAvatar });

      // Send current participants to new user
      socket.emit('room-participants', participants);

      // Update DB
      try {
        await Meeting.findOneAndUpdate(
          { meetingId },
          { $addToSet: { participants: userId }, status: 'active' }
        );
      } catch (e) { console.error(e); }

      console.log(`${userName} joined room ${meetingId}`);
    });

    // WebRTC signaling
    socket.on('offer', ({ to, offer }) => {
      socket.to(to).emit('offer', { from: socket.id, offer });
    });

    socket.on('answer', ({ to, answer }) => {
      socket.to(to).emit('answer', { from: socket.id, answer });
    });

    socket.on('ice-candidate', ({ to, candidate }) => {
      socket.to(to).emit('ice-candidate', { from: socket.id, candidate });
    });

    // Chat messages
    socket.on('send-message', async ({ meetingId, message }) => {
      const { senderId, senderName, content } = message;
      const msgData = { senderId, senderName, content, timestamp: new Date() };

      io.to(meetingId).emit('receive-message', msgData);

      try {
        await Meeting.findOneAndUpdate(
          { meetingId },
          { $push: { messages: msgData } }
        );
      } catch (e) { console.error(e); }
    });

    // Media state changes
    socket.on('media-state', ({ meetingId, audioEnabled, videoEnabled }) => {
      socket.to(meetingId).emit('peer-media-state', {
        socketId: socket.id,
        audioEnabled,
        videoEnabled,
      });
    });

    // Leave room
    socket.on('leave-room', ({ meetingId }) => {
      handleLeave(socket, meetingId, io);
    });

    socket.on('disconnect', () => {
      rooms.forEach((participants, meetingId) => {
        if (participants.has(socket.id)) {
          handleLeave(socket, meetingId, io);
        }
      });
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

function handleLeave(socket, meetingId, io) {
  if (rooms.has(meetingId)) {
    const user = rooms.get(meetingId).get(socket.id);
    rooms.get(meetingId).delete(socket.id);
    if (rooms.get(meetingId).size === 0) rooms.delete(meetingId);

    socket.to(meetingId).emit('user-left', { socketId: socket.id, name: user?.name });
    socket.leave(meetingId);
  }
}

module.exports = { setupSocket };
