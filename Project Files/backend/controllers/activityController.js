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

// @desc    Export activity logs as CSV
// @route   GET /api/activities/export
// @access  Private/Admin
const exportActivities = async (req, res) => {
    try {
        const logs = await ActivityLog.find()
            .populate('user', 'name email role')
            .sort({ createdAt: -1 });

        // Filter out admin logs
        const filteredLogs = logs.filter(log => log.user && log.user.role !== 'admin');

        // Manual CSV Generation
        const headers = ['Time', 'User Name', 'User Email', 'Role', 'Action', 'Details'];
        const csvRows = [];

        // Add Header
        csvRows.push(headers.join(','));

        // Add Data
        filteredLogs.forEach(log => {
            const row = [
                `"${new Date(log.createdAt).toLocaleString()}"`,
                `"${log.user ? log.user.name : 'Unknown'}"`,
                `"${log.user ? log.user.email : 'N/A'}"`,
                `"${log.user ? log.user.role : 'N/A'}"`,
                `"${log.action}"`,
                `"${log.details.replace(/"/g, '""')}"` // Escape quotes in details
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');

        res.header('Content-Type', 'text/csv');
        res.attachment('activity_logs.csv');
        return res.send(csvString);

    } catch (error) {
        console.error('Export failed:', error);
        res.status(500).json({ message: 'Failed to export logs' });
    }
};

module.exports = { getActivities, exportActivities };
