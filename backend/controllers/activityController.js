const ActivityLog = require('../schemas/ActivityLog');

// @desc    Get all activity logs
// @route   GET /api/activities
// @access  Private/Admin
const getActivities = async (req, res) => {
    try {
        const logs = await ActivityLog.find()
            .populate('user', 'name email role')
            .sort({ createdAt: -1 });

        // Filter out admin logs
        const filteredLogs = logs.filter(log => log.user && log.user.role !== 'admin');

        res.json(filteredLogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getActivities };
