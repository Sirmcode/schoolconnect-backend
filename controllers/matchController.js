const Teacher = require('../models/Teacher');
const Job = require('../models/Job');
const School = require('../models/School');

// The 100-point scoring logic ported from frontend app.js
const calculateMatchScore = (teacher, job, school) => {
    let score = 0;

    // 1. Subject/Role Match (40 pts)
    const jobSubjectsLC = job.subjects.map(s => s.toLowerCase());
    const teacherSubjectsLC = teacher.subjects.map(s => s.toLowerCase());
    const hasSubjectMatch = jobSubjectsLC.some(subj => teacherSubjectsLC.includes(subj));
    if (hasSubjectMatch) {
        score += 40;
    }

    // 2. Role Type Alignment (15 pts) -> from UI feedback
    if (job.roleType === teacher.roleType) {
        score += 15;
    }

    // 3. Availability Match (25 pts)
    if (teacher.availability === 'Both') {
        score += 25;
    } else if (teacher.availability === job.employmentType) {
        score += 25;
    } else if (teacher.availability === 'Part-Time' && job.employmentType === 'Contract') {
        score += 20; // partial match
    }

    // 4. Location Match (20 pts)
    if (teacher.state === school.state) {
        score += 10;
        if (teacher.lga === school.lga) {
            score += 10;
        }
    }

    return score;
};

// @desc    Get top teacher matches for a specific job (School view)
// @route   GET /api/v1/matches/job/:jobId
exports.getTeacherMatchesForJob = async (req, res) => {
    try {
        if (req.user.role !== 'school') return res.status(403).json({ message: 'Not authorized' });

        const job = await Job.findById(req.params.jobId).populate('schoolId');
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Ensure school owns the job
        if (job.schoolId.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view matches for this job' });
        }

        const teachers = await Teacher.find({});

        const matches = teachers.map(teacher => {
            const score = calculateMatchScore(teacher, job, job.schoolId);
            return {
                teacher,
                matchScore: score
            };
        }).filter(m => m.matchScore > 20) // Only return vaguely relevant people
            .sort((a, b) => b.matchScore - a.matchScore); // Highest first

        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get top job matches for current teacher (Teacher view)
// @route   GET /api/v1/matches/me
exports.getMyJobMatches = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Not authorized' });

        const teacher = await Teacher.findOne({ userId: req.user._id });
        if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });

        const jobs = await Job.find({ status: 'Open' }).populate('schoolId');

        const matches = jobs.map(job => {
            const score = calculateMatchScore(teacher, job, job.schoolId);
            return {
                job,
                matchScore: score
            };
        }).filter(m => m.matchScore > 20)
            .sort((a, b) => b.matchScore - a.matchScore);

        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
