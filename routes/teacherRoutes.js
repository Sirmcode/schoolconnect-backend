const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

// @desc    Get all teachers (public, filterable)
// @route   GET /api/v1/teachers
router.get('/', async (req, res) => {
    try {
        const { subject, state, availability, level, roleType } = req.query;

        let query = {};
        if (subject) query.subjects = { $in: [new RegExp(subject, 'i')] };
        if (state) query.state = new RegExp(state, 'i');
        if (availability && availability !== 'Any') query.availability = availability;
        if (level) query.schoolLevels = { $in: [new RegExp(level, 'i')] };
        if (roleType) query.roleType = roleType;

        const teachers = await Teacher.find(query).sort('-createdAt');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single teacher by ID
// @route   GET /api/v1/teachers/:id
router.get('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
