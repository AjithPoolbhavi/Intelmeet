const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderName: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const participantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  joinedAt: { type: Date, default: Date.now },
  leftAt: Date,
});

const meetingSchema = new mongoose.Schema({
  meetingId: { type: String, default: () => uuidv4().substring(0, 8).toUpperCase(), unique: true },
  title: { type: String, required: true, trim: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostName: String,
  status: { type: String, enum: ['scheduled', 'active', 'ended'], default: 'scheduled' },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  duration: Number, // in minutes
  participants: [participantSchema],
  messages: [messageSchema],
  summary: { type: String, default: '' },
  actionItems: [{ type: String }],
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Meeting', meetingSchema);
