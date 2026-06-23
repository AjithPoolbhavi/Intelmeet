const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

// In-memory store for mock mode
const mockMeetings = new Map();

let Meeting;
try { Meeting = require('../models/Meeting'); } catch(e) {}

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

const generateMeetingId = () => uuidv4().substring(0, 8).toUpperCase();

exports.createMeeting = async (req, res) => {
  try {
    const { title, tags, status, startTime } = req.body;
    if (!title) return res.status(400).json({ message: 'Meeting title is required' });

    const meetingData = {
      meetingId: generateMeetingId(),
      title,
      host: req.user.id,
      hostName: req.user.name || 'Host',
      status: status || 'active',
      startTime: startTime ? new Date(startTime) : new Date(),
      participants: [],
      messages: [],
      tags: tags || [],
    };

    if (Meeting && isDbConnected()) {
      try {
        const meeting = await Meeting.create(meetingData);
        return res.status(201).json({ meeting });
      } catch(e) { console.log('DB error, mock mode'); }
    }

    // Mock mode
    const id = Date.now().toString();
    const meeting = { ...meetingData, _id: id, id };
    mockMeetings.set(meetingData.meetingId, meeting);
    res.status(201).json({ meeting });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    if (Meeting && isDbConnected()) {
      try {
        const meeting = await Meeting.findOne({ meetingId: id }).populate('host', 'name email');
        if (meeting) return res.json({ meeting });
      } catch(e) {}
    }

    const meeting = mockMeetings.get(id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json({ meeting });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserMeetings = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (Meeting && isDbConnected()) {
      try {
        const meetings = await Meeting.find({ host: userId }).sort({ createdAt: -1 }).limit(20);
        if (meetings) return res.json({ meetings });
      } catch(e) {}
    }

    // Mock: return all mock meetings for demo
    const meetings = Array.from(mockMeetings.values()).slice(0, 10);
    res.json({ meetings });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.endMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const endTime = new Date();

    if (Meeting && isDbConnected()) {
      try {
        const meeting = await Meeting.findOne({ meetingId: id });
        if (meeting) {
          const duration = Math.floor((endTime - meeting.startTime) / 60000);
          meeting.status = 'ended';
          meeting.endTime = endTime;
          meeting.duration = duration;
          await meeting.save();
          return res.json({ meeting });
        }
      } catch(e) {}
    }

    const meeting = mockMeetings.get(id);
    if (meeting) {
      meeting.status = 'ended';
      meeting.endTime = endTime;
      mockMeetings.set(id, meeting);
    }
    res.json({ meeting: meeting || { meetingId: id, status: 'ended' } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.saveSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const { summary, actionItems } = req.body;

    if (Meeting && isDbConnected()) {
      try {
        const meeting = await Meeting.findOneAndUpdate(
          { meetingId: id },
          { summary, actionItems },
          { new: true }
        );
        if (meeting) return res.json({ meeting });
      } catch(e) {}
    }

    const meeting = mockMeetings.get(id);
    if (meeting) {
      meeting.summary = summary;
      meeting.actionItems = actionItems;
      mockMeetings.set(id, meeting);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
