const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
    },
    title: { type: String, required: true },
    roleType: {
        type: String,
        enum: ['Class Teacher', 'Subject Teacher'],
        required: true,
    },
    level: { type: String, required: true },
    subjects: [{ type: String }],

    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    employmentType: {
        type: String,
        enum: ['Full-Time', 'Part-Time', 'Both', 'Contract'],
        required: true,
    },
    description: { type: String, default: '' },

    deadline: { type: Date },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Job', jobSchema);
