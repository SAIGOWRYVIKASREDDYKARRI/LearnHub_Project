const express = require('express');
const router = express.Router();
const { getActivities } = require('../controllers/activityController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', protect, authorize('admin'), getActivities);

module.exports = router;
