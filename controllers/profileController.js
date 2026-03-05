const Teacher = require('../models/Teacher');
const School = require('../models/School');

// @desc    Get current logged in user's profile
// @route   GET /api/v1/profile/me
exports.getMe = async (req, res) => {
    try {
        let profile;
        if (req.user.role === 'teacher') {
            profile = await Teacher.findOne({ userId: req.user._id });
        } else if (req.user.role === 'school') {
            profile = await School.findOne({ userId: req.user._id });
        }

        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        res.json({
            user: req.user,
            profile
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Teacher profile
// @route   PUT /api/v1/profile/teacher
exports.updateTeacherProfile = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Not authorized' });

        const profile = await Teacher.findOneAndUpdate(
            { userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update School profile
// @route   PUT /api/v1/profile/school
exports.updateSchoolProfile = async (req, res) => {
    try {
        if (req.user.role !== 'school') return res.status(403).json({ message: 'Not authorized' });

        const profile = await School.findOneAndUpdate(
            { userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
