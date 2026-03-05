const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },
    status: {
        type: String,
        enum: ['Applied', 'Interview', 'Offered', 'Rejected', 'Withdrawn'],
        default: 'Applied',
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Application', applicationSchema);
