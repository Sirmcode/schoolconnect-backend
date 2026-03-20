const express = require('express');
const router = express.Router();
const { getMe, updateTeacherProfile, updateSchoolProfile, messageTeacher, messageSchool, getInbox } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.get('/me', protect, getMe);
router.put('/teacher', protect, updateTeacherProfile);
router.put('/school', protect, updateSchoolProfile);

// Message endpoints
router.post('/message-teacher', protect, messageTeacher);
router.post('/message-school', protect, messageSchool);
router.get('/message-inbox', protect, getInbox);

module.exports = router;
