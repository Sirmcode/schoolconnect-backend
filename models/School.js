const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    schoolName: { type: String, required: true },
    phone: { type: String, required: true },
    state: { type: String, required: true },
    lga: { type: String, required: true },
    address: { type: String, required: true },

    institutionTypes: [{ type: String }],

    plan: {
        type: String,
        enum: ['Free Trial', 'Basic', 'Pro'],
        default: 'Free Trial',
    },
    planExpiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days trial
    },
    scoutLeadsUsed: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('School', schoolSchema);
