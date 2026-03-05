const Application = require('../models/Application');
const Job = require('../models/Job');
const Teacher = require('../models/Teacher');
const School = require('../models/School');

// @desc    Apply to a job (Teacher)
// @route   POST /api/v1/applications/:jobId
exports.applyForJob = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Only teachers can apply for jobs' });

        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.status !== 'Open') return res.status(400).json({ message: 'This job is no longer open' });

        const teacher = await Teacher.findOne({ userId: req.user._id });
        if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });

        // Check if already applied
        const existingApp = await Application.findOne({ jobId: job._id, teacherId: teacher._id });
        if (existingApp) return res.status(400).json({ message: 'You have already applied for this job' });

        // In a real scenario, we'd calculate match score here before saving
        // For now we'll put a placeholder score
        const matchScore = req.body.matchScore || 85;

        const application = await Application.create({
            jobId: job._id,
            teacherId: teacher._id,
            matchScore
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications for a specific school
// @route   GET /api/v1/applications/school
exports.getSchoolApplications = async (req, res) => {
    try {
        if (req.user.role !== 'school') return res.status(403).json({ message: 'Not authorized' });

        const school = await School.findOne({ userId: req.user._id });
        if (!school) return res.status(404).json({ message: 'School profile not found' });

        // Find all jobs posted by this school
        const jobs = await Job.find({ schoolId: school._id }).select('_id title roleType');
        const jobIds = jobs.map(j => j._id);

        // Find applications for those jobs
        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('teacherId', 'firstName lastName category state lga subjects')
            .populate('jobId', 'title')
            .sort('-appliedAt');

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications by a specific teacher
// @route   GET /api/v1/applications/me
exports.getMyTeacherApplications = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Not authorized' });

        const teacher = await Teacher.findOne({ userId: req.user._id });
        if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });

        const applications = await Application.find({ teacherId: teacher._id })
            .populate({
                path: 'jobId',
                select: 'title schoolId',
                populate: {
                    path: 'schoolId',
                    select: 'schoolName state lga'
                }
            })
            .sort('-appliedAt');

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status (School)
// @route   PATCH /api/v1/applications/:id/status
exports.updateApplicationStatus = async (req, res) => {
    try {
        if (req.user.role !== 'school') return res.status(403).json({ message: 'Not authorized' });

        const { status } = req.body;
        if (!['Applied', 'Interview', 'Offered', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Verify the school owns the job related to this application
        const application = await Application.findById(req.params.id).populate('jobId');
        if (!application) return res.status(404).json({ message: 'Application not found' });

        const school = await School.findOne({ userId: req.user._id });

        if (application.jobId.schoolId.toString() !== school._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this application' });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
