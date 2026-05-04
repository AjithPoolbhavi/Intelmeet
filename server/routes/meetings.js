const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createMeeting, getMeeting, getUserMeetings, endMeeting, saveSummary
} = require('../controllers/meetingController');

router.post('/create', auth, createMeeting);
router.get('/user/:userId', auth, getUserMeetings);
router.get('/:id', getMeeting);
router.put('/:id/end', auth, endMeeting);
router.put('/:id/summary', auth, saveSummary);

module.exports = router;
