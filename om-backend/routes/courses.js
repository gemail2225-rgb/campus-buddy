import express from 'express';
import Course from '../models/Course.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

// GET all courses (filter by role)
router.get('/', auth, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'professor') {
      filter.professor = req.user._id;
    } else if (req.user.role === 'student') {
      filter.students = req.user._id;
    }
    // Admin sees all courses (no filter)

    const courses = await Course.find(filter)
      .populate('professor', 'name')
      .populate('students', 'name email'); // For professor view, we need student details
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET single course (with full details)
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('professor', 'name')
      .populate('students', 'name email');
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Check authorization: professor of this course, enrolled student, or admin
    const isProfessor = course.professor._id.toString() === req.user._id.toString();
    const isStudent = course.students.some(s => s._id.toString() === req.user._id.toString());
    if (!isProfessor && !isStudent && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create course (admin only)
router.post('/', auth, role(['admin']), async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT update course (professor or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    if (course.professor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE course (admin only)
router.delete('/:id', auth, role(['admin']), async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Course removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;