const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob, getMySchoolJobs } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

router.get('/', getJobs);
router.get('/:id', getJob);
router.post('/', protect, createJob);
router.get('/me/posted', protect, getMySchoolJobs);

module.exports = router;
