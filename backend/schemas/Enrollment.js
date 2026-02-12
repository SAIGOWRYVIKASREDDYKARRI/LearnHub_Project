const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    progress: {
        completedSections: [{ type: String }], // Store section IDs/Titles
        isCompleted: { type: Boolean, default: false }
    }
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
