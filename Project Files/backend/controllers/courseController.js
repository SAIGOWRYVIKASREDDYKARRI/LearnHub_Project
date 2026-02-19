const Course = require('../schemas/Course');
const Enrollment = require('../schemas/Enrollment');
const logActivity = require('../utils/activityLogger'); // Import Logger

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const courses = await Course.find({ ...keyword }).populate('educator', 'name email');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('educator', 'name email');

        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Teacher/Admin
const createCourse = async (req, res) => {
    const { title, description, category, price } = req.body;

    if (!title || !description || !category) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const course = new Course({
            title,
            description,
            category,
            price,
            educator: req.user._id,
            sections: []
        });

        const createdCourse = await course.save();

        // Log Activity
        await logActivity(req.user._id, 'CREATE_COURSE', `Created course: ${title}`, req.ip);

        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Teacher/Admin
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            // Check if user is course owner or admin
            if (course.educator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to update this course' });
            }

            course.title = req.body.title || course.title;
            course.description = req.body.description || course.description;
            course.category = req.body.category || course.category;
            course.price = req.body.price !== undefined ? req.body.price : course.price;

            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Teacher/Admin
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            // Check if user is course owner or admin
            if (course.educator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to delete this course' });
            }

            await course.deleteOne();

            // Log Activity
            await logActivity(req.user._id, 'DELETE_COURSE', `Deleted course: ${course.title}`, req.ip);

            res.json({ message: 'Course removed' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add section to course
// @route   POST /api/courses/:id/sections
// @access  Private/Teacher/Admin
const addSection = async (req, res) => {
    const { title, videoUrl, isFree } = req.body;

    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            // Check if user is course owner or admin
            if (course.educator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to update this course' });
            }

            const newSection = {
                title,
                videoUrl,
                isFree: isFree || false
            };

            course.sections.push(newSection);
            await course.save();
            res.status(201).json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
const enrollCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check availability (already enrolled)
        const existingEnrollment = await Enrollment.findOne({
            student: req.user._id,
            course: req.params.id
        });

        if (existingEnrollment) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        const enrollment = new Enrollment({
            student: req.user._id,
            course: req.params.id
        });

        await enrollment.save();

        course.enrolledCount += 1;
        course.enrolledCount += 1;
        await course.save();

        // Log Activity
        await logActivity(req.user._id, 'ENROLL_COURSE', `Enrolled in course: ${course.title}`, req.ip);

        res.status(201).json({ message: 'Enrolled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get enrolled courses
// @route   GET /api/courses/enrolled/me
// @access  Private/Student
const getEnrolledCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user._id })
            .populate('course')
            .populate({
                path: 'course',
                populate: { path: 'educator', select: 'name' }
            });

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get courses created by current teacher
// @route   GET /api/courses/my
// @access  Private/Teacher
const getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({ educator: req.user._id });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    addSection,
    enrollCourse,
    getEnrolledCourses,
    getMyCourses
};
