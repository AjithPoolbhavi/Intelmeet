const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' },
  type: { type: String, enum: ['meeting', 'message', 'task'], default: 'meeting' },
  action: String,
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
  sessionId: String,
});

analyticsSchema.index({ userId: 1, timestamp: -1 });
analyticsSchema.index({ meetingId: 1, timestamp: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
