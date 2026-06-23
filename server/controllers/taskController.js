const mockTasks = new Map();
let taskIdCounter = 1;
const mongoose = require('mongoose');

let Task;
try { Task = require('../models/Task'); } catch(e) {}

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

exports.getTasks = async (req, res) => {
  try {
    if (Task && isDbConnected()) {
      try {
        const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
        return res.json({ tasks });
      } catch(e) {}
    }
    const tasks = Array.from(mockTasks.values()).filter(t => t.owner === req.user.id);
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, meetingRef } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const taskData = {
      title, description: description || '', status: status || 'todo',
      priority: priority || 'medium', owner: req.user.id,
      dueDate: dueDate ? new Date(dueDate) : null,
      meetingRef: meetingRef || null, createdAt: new Date(),
    };

    if (Task && isDbConnected()) {
      try {
        const task = await Task.create(taskData);
        return res.status(201).json({ task });
      } catch(e) {}
    }

    const id = (taskIdCounter++).toString();
    const task = { ...taskData, _id: id, id };
    mockTasks.set(id, task);
    res.status(201).json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (Task && isDbConnected()) {
      try {
        const task = await Task.findByIdAndUpdate(id, updates, { new: true });
        if (task) return res.json({ task });
      } catch(e) {}
    }

    const task = mockTasks.get(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const updated = { ...task, ...updates };
    mockTasks.set(id, updated);
    res.json({ task: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (Task && isDbConnected()) {
      try {
        await Task.findByIdAndDelete(id);
        return res.json({ success: true });
      } catch(e) {}
    }
    mockTasks.delete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
