const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workspace = require('../models/Workspace');
const User = require('../models/User');

// Create workspace
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    const workspace = new Workspace({
      name,
      description,
      icon,
      owner: req.userId,
      members: [{ userId: req.userId, role: 'owner' }],
    });

    await workspace.save();
    await workspace.populate('owner members.userId');

    res.status(201).json(workspace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all workspaces for user
router.get('/', auth, async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [
        { owner: req.userId },
        { 'members.userId': req.userId },
      ],
    }).populate('owner members.userId');

    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get workspace by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id).populate('owner members.userId');

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Check if user has access
    const isMember = workspace.members.some(m => m.userId._id.toString() === req.userId);
    const isOwner = workspace.owner._id.toString() === req.userId;

    if (!isMember && !isOwner) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(workspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add member to workspace
router.post('/:id/members', auth, async (req, res) => {
  try {
    const { userId, role = 'member' } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Check if user is owner or admin
    const userRole = workspace.members.find(m => m.userId.toString() === req.userId)?.role;
    if (userRole !== 'owner' && userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can add members' });
    }

    // Check if member already exists
    if (workspace.members.some(m => m.userId.toString() === userId)) {
      return res.status(400).json({ error: 'Member already exists' });
    }

    workspace.members.push({ userId, role });
    await workspace.save();
    await workspace.populate('owner members.userId');

    res.json(workspace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove member from workspace
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Check if user is owner
    if (workspace.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only owner can remove members' });
    }

    workspace.members = workspace.members.filter(m => m.userId.toString() !== req.params.userId);
    await workspace.save();
    await workspace.populate('owner members.userId');

    res.json(workspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update workspace settings
router.put('/:id/settings', auth, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Check if user is owner or admin
    const userRole = workspace.members.find(m => m.userId.toString() === req.userId)?.role;
    if (userRole !== 'owner' && userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    Object.assign(workspace.settings, req.body);
    await workspace.save();

    res.json(workspace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete workspace
router.delete('/:id', auth, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Check if user is owner
    if (workspace.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only owner can delete workspace' });
    }

    await Workspace.findByIdAndDelete(req.params.id);

    res.json({ message: 'Workspace deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
