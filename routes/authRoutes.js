const express = require('express');
const router = express.Router();
const { registerTeacher, registerSchool, login } = require('../controllers/authController');

router.post('/register/teacher', registerTeacher);
router.post('/register/school', registerSchool);
router.post('/login', login);

module.exports = router;
