const ActivityLog = require('../schemas/ActivityLog');

const logActivity = async (userId, action, details = '', ip = '') => {
    try {
        await ActivityLog.create({
            user: userId,
            action,
            details,
            ip
        });
    } catch (error) {
        console.error('Failed to log activity:', error.message);
        // We don't want to block the main flow if logging fails
    }
};

module.exports = logActivity;
