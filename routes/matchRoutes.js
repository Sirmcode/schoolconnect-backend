const express = require('express');
const router = express.Router();
const { getTeacherMatchesForJob, getMyJobMatches } = require('../controllers/matchController');
const { protect } = require('../middleware/auth');

router.get('/job/:jobId', protect, getTeacherMatchesForJob);
router.get('/me', protect, getMyJobMatches);

module.exports = router;
