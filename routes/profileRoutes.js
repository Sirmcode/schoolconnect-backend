const express = require('express');
const router = express.Router();
const { getMe, updateTeacherProfile, updateSchoolProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.get('/me', protect, getMe);
router.put('/teacher', protect, updateTeacherProfile);
router.put('/school', protect, updateSchoolProfile);

module.exports = router;
