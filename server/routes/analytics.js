const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Analytics = require('../models/Analytics');
const Meeting = require('../models/Meeting');

// Track event
router.post('/events', auth, async (req, res) => {
  try {
    const { type, action, metadata, meetingId } = req.body;

    const analytics = new Analytics({
      userId: req.userId,
      type,
      action,
      metadata,
      meetingId,
      sessionId: req.body.sessionId || `session-${Date.now()}`,
    });

    await analytics.save();

    res.status(201).json(analytics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user analytics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Total meetings
    const totalMeetings = await Meeting.countDocuments({
      $or: [
        { host: req.userId },
        { 'participants.userId': req.userId },
      ],
    });

    // Get meeting stats
    const meetings = await Meeting.find({
      $or: [
        { host: req.userId },
        { 'participants.userId': req.userId },
      ],
      createdAt: { $gte: startDate },
    });

    const totalDuration = meetings.reduce((sum, m) => sum + (m.duration || 0), 0);
    const avgParticipants = meetings.length > 0
      ? Math.round(meetings.reduce((sum, m) => sum + (m.participants?.length || 0), 0) / meetings.length)
      : 0;

    // Meeting trends
    const meetingTrend = {};
    meetings.forEach((m) => {
      const date = new Date(m.createdAt).toLocaleDateString();
      meetingTrend[date] = (meetingTrend[date] || 0) + 1;
    });

    // Most active times
    const hourStats = {};
    meetings.forEach((m) => {
      const hour = new Date(m.startTime).getHours();
      hourStats[hour] = (hourStats[hour] || 0) + 1;
    });

    // Events analytics
    const totalEvents = await Analytics.countDocuments({
      userId: req.userId,
      timestamp: { $gte: startDate },
    });

    const messageCount = await Analytics.countDocuments({
      userId: req.userId,
      type: 'message',
      timestamp: { $gte: startDate },
    });

    const taskCount = await Analytics.countDocuments({
      userId: req.userId,
      type: 'task',
      timestamp: { $gte: startDate },
    });

    res.json({
      totalMeetings,
      totalDuration: Math.round(totalDuration / 60),
      averageParticipants: avgParticipants,
      totalEvents,
      messageCount,
      taskCount,
      meetingTrend: Object.entries(meetingTrend).map(([date, count]) => ({ date, count })),
      hourStats: Object.entries(hourStats).map(([hour, count]) => ({ hour: parseInt(hour), count })),
      productivityScore: calculateProductivityScore(totalMeetings, totalDuration, taskCount),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get meeting analytics
router.get('/meeting/:meetingId', auth, async (req, res) => {
  try {
    const events = await Analytics.find({
      meetingId: req.params.meetingId,
    }).sort({ timestamp: -1 });

    const participants = await Analytics.distinct('userId', {
      meetingId: req.params.meetingId,
      type: 'meeting',
    });

    const messageCount = events.filter(e => e.type === 'message').length;
    const avgSessionDuration = calculateAvgSessionDuration(events);

    res.json({
      events,
      participants: participants.length,
      messageCount,
      avgSessionDuration,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get productivity insights
router.get('/insights/productivity', auth, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const meetings = await Meeting.countDocuments({
      $or: [
        { host: req.userId },
        { 'participants.userId': req.userId },
      ],
      createdAt: { $gte: startDate },
    });

    const tasks = await Analytics.countDocuments({
      userId: req.userId,
      type: 'task',
      timestamp: { $gte: startDate },
    });

    const messages = await Analytics.countDocuments({
      userId: req.userId,
      type: 'message',
      timestamp: { $gte: startDate },
    });

    const score = calculateProductivityScore(meetings, 0, tasks);

    res.json({
      score,
      meetings,
      tasks,
      messages,
      trend: meetings > 0 ? 'up' : 'stable',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function calculateProductivityScore(meetings, duration, tasks) {
  const meetingScore = Math.min(meetings * 10, 30);
  const durationScore = Math.min((duration / 60) * 2, 30);
  const taskScore = Math.min(tasks * 10, 40);
  return Math.round(((meetingScore + durationScore + taskScore) / 100) * 100);
}

function calculateAvgSessionDuration(events) {
  if (events.length === 0) return 0;
  const sessions = {};
  events.forEach((e) => {
    const sessionId = e.sessionId;
    if (!sessions[sessionId]) {
      sessions[sessionId] = [];
    }
    sessions[sessionId].push(e.timestamp);
  });

  let totalDuration = 0;
  Object.values(sessions).forEach((timestamps) => {
    if (timestamps.length > 1) {
      const duration = new Date(timestamps[timestamps.length - 1]) - new Date(timestamps[0]);
      totalDuration += duration / 1000 / 60; // Convert to minutes
    }
  });

  return Math.round(totalDuration / Object.keys(sessions).length);
}

module.exports = router;
