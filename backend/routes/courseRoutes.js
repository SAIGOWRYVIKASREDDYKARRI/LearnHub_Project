const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    addSection,
    enrollCourse,
    getEnrolledCourses
} = require('../controllers/courseController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getCourses)
    .post(protect, authorize('teacher', 'admin'), createCourse);

router.route('/:id')
    .get(getCourseById)
    .put(protect, authorize('teacher', 'admin'), updateCourse)
    .delete(protect, authorize('teacher', 'admin'), deleteCourse);

router.route('/:id/sections').post(protect, authorize('teacher', 'admin'), addSection);
router.route('/:id/enroll').post(protect, authorize('student'), enrollCourse);
router.get('/enrolled/me', protect, getEnrolledCourses);

module.exports = router;
