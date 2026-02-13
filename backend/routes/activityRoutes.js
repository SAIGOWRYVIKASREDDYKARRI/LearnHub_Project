const express = require('express');
const router = express.Router();
const { getActivities, exportActivities } = require('../controllers/activityController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', protect, authorize('admin'), getActivities);
router.get('/export', protect, authorize('admin'), exportActivities);

module.exports = router;
