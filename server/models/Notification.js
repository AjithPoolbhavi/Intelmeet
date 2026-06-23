const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['meeting', 'message', 'mention', 'task', 'system'], default: 'system' },
  read: { type: Boolean, default: false },
  actionUrl: String,
  icon: String,
  relatedId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
});

notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
