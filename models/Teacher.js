const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    state: { type: String, required: true },
    lga: { type: String, required: true },

    category: {
        type: String,
        enum: ['Qualified Teacher', 'NYSC Corps Member', 'Student/Undergraduate', 'Career Changer'],
        required: true,
    },
    roleType: {
        type: String,
        enum: ['Class Teacher', 'Subject Teacher'],
        required: true,
    },
    subjects: [{ type: String }],
    schoolLevels: [{ type: String }],
    availability: {
        type: String,
        enum: ['Full-Time', 'Part-Time', 'Both'],
        required: true,
    },
    cvUrl: { type: String },

    plan: {
        type: String,
        enum: ['Free', 'Verified'],
        default: 'Free',
    },
    verifiedUntil: { type: Date },
});

module.exports = mongoose.model('Teacher', teacherSchema);
