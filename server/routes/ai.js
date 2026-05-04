const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateSummary, generateActionItems } = require('../controllers/aiController');

router.post('/summary', auth, generateSummary);
router.post('/action-items', auth, generateActionItems);

module.exports = router;
