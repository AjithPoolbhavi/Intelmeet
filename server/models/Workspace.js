const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  icon: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['owner', 'admin', 'member', 'guest'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
  }],
  settings: {
    isPublic: Boolean,
    allowMemberInvite: { type: Boolean, default: true },
    defaultRole: { type: String, enum: ['member', 'guest'], default: 'member' },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Workspace', workspaceSchema);
