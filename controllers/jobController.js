const Job = require('../models/Job');
const School = require('../models/School');

// @desc    Get all active jobs (filterable)
// @route   GET /api/v1/jobs
exports.getJobs = async (req, res) => {
    try {
        const { subject, roleType, level, employmentType, location } = req.query;

        // Build query
        let query = { status: 'Open' };

        if (subject) query.subjects = { $in: [subject] };
        if (roleType) query.roleType = roleType;
        if (level) query.level = level;
        if (employmentType) query.employmentType = employmentType;

        // If location is provided, we need to join with School collection
        // For MVP, we'll keep it simple and just return jobs, frontend handles advanced filtering
        // In production, an aggregation pipeline would be used here

        const jobs = await Job.find(query)
            .populate('schoolId', 'schoolName state lga')
            .sort('-createdAt');

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single job
// @route   GET /api/v1/jobs/:id
exports.getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('schoolId', 'schoolName state lga address institutionTypes');

        if (!job) return res.status(404).json({ message: 'Job not found' });

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a job
// @route   POST /api/v1/jobs
exports.createJob = async (req, res) => {
    try {
        if (req.user.role !== 'school') return res.status(403).json({ message: 'Only schools can post jobs' });

        // Get the school profile ID for this user
        const school = await School.findOne({ userId: req.user._id });
        if (!school) return res.status(404).json({ message: 'School profile not found' });

        // Add schoolId to the body
        req.body.schoolId = school._id;

        const job = await Job.create(req.body);

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get specific school's jobs
// @route   GET /api/v1/schools/jobs
exports.getMySchoolJobs = async (req, res) => {
    try {
        if (req.user.role !== 'school') return res.status(403).json({ message: 'Not authorized' });

        const school = await School.findOne({ userId: req.user._id });
        if (!school) return res.status(404).json({ message: 'School profile not found' });

        const jobs = await Job.find({ schoolId: school._id }).sort('-createdAt');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
