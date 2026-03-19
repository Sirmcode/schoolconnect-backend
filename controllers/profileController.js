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

const { sendTeacherMessage, sendSchoolMessage } = require('../services/emailService');

// @desc    Send Message to Teacher
// @route   POST /api/v1/profile/message-teacher
exports.messageTeacher = async (req, res) => {
    try {
        const { teacherId, message, contact } = req.body;
        const teacherProfile = await Teacher.findById(teacherId).populate('userId');
        if (!teacherProfile || !teacherProfile.userId) return res.status(404).json({ message: 'Teacher not found' });
        
        let schoolName = req.body.senderName || 'A School';
        if (req.user && req.user.role === 'school') {
            const schoolProfile = await School.findOne({ userId: req.user._id });
            if (schoolProfile) schoolName = schoolProfile.schoolName;
        }

        await sendTeacherMessage({
            teacherEmail: teacherProfile.userId.email,
            teacherName: teacherProfile.firstName,
            schoolName,
            schoolContact: contact || (req.user ? req.user.email : 'No contact provided'),
            message
        });

        res.json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send Message to School
// @route   POST /api/v1/profile/message-school
exports.messageSchool = async (req, res) => {
    try {
        const { schoolId, message, contact } = req.body;
        
        // Find school by ID or name
        let schoolProfile;
        if (schoolId && schoolId.length > 10) {
            schoolProfile = await School.findById(schoolId).populate('userId');
        } else if (req.body.schoolName) {
            schoolProfile = await School.findOne({ schoolName: req.body.schoolName }).populate('userId');
        }
        
        if (!schoolProfile || !schoolProfile.userId) return res.status(404).json({ message: 'School not found' });
        
        let teacherName = req.body.senderName || 'A Teacher';
        if (req.user && req.user.role === 'teacher') {
            const profile = await Teacher.findOne({ userId: req.user._id });
            if (profile) teacherName = profile.firstName + ' ' + profile.lastName;
        }

        await sendSchoolMessage({
            schoolEmail: schoolProfile.userId.email,
            schoolName: schoolProfile.schoolName,
            teacherName,
            teacherContact: contact || (req.user ? req.user.email : 'No contact provided'),
            message
        });

        res.json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
