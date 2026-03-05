const User = require('../models/User');
const Teacher = require('../models/Teacher');
const School = require('../models/School');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_schoolconnect', {
        expiresIn: '30d',
    });
};

// @desc    Register new teacher
// @route   POST /api/v1/auth/register/teacher
exports.registerTeacher = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone, state, lga, category, roleType, subjects, schoolLevels, availability } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            email,
            passwordHash,
            role: 'teacher'
        });

        // Create teacher profile
        const teacher = await Teacher.create({
            userId: user._id,
            firstName, lastName, phone, state, lga, category, roleType, subjects, schoolLevels, availability
        });

        res.status(201).json({
            _id: user.id,
            email: user.email,
            role: user.role,
            profile: teacher,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register new school
// @route   POST /api/v1/auth/register/school
exports.registerSchool = async (req, res) => {
    try {
        const { email, password, schoolName, phone, state, lga, address, institutionTypes } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            email,
            passwordHash,
            role: 'school'
        });

        // Create school profile
        const school = await School.create({
            userId: user._id,
            schoolName, phone, state, lga, address, institutionTypes
        });

        res.status(201).json({
            _id: user.id,
            email: user.email,
            role: user.role,
            profile: school,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/v1/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Get specific profile based on role
        let profile = null;
        if (user.role === 'teacher') {
            profile = await Teacher.findOne({ userId: user._id });
        } else if (user.role === 'school') {
            profile = await School.findOne({ userId: user._id });
        }

        res.json({
            _id: user.id,
            email: user.email,
            role: user.role,
            profile,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
