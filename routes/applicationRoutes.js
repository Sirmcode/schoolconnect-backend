const express = require('express');
const router = express.Router();
const { applyForJob, getSchoolApplications, getMyTeacherApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

router.post('/:jobId/apply', protect, applyForJob);
router.get('/school', protect, getSchoolApplications);
router.get('/me', protect, getMyTeacherApplications);
router.patch('/:id/status', protect, updateApplicationStatus);

module.exports = router;
