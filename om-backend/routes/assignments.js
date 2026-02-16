import express from 'express';
import Assignment from '../models/Assignment.js';
import Course from '../models/Course.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

// GET all assignments (filter by user's courses)
router.get('/', auth, async (req, res) => {
  try {
    let courseIds = [];
    if (req.user.role === 'professor') {
      // Get courses taught by this professor
      const courses = await Course.find({ professor: req.user._id }).select('_id');
      courseIds = courses.map(c => c._id);
    } else if (req.user.role === 'student') {
      // Get courses where student is enrolled
      const courses = await Course.find({ students: req.user._id }).select('_id');
      courseIds = courses.map(c => c._id);
    }
    // Admin: no filter (all assignments) – if we want admin to see all, keep courseIds empty
    let filter = {};
    if (courseIds.length > 0) {
      filter.course = { $in: courseIds };
    } else if (req.user.role !== 'admin') {
      // No courses, return empty array
      return res.json([]);
    }
    const assignments = await Assignment.find(filter)
      .populate('course', 'courseCode courseName')
      .populate('submissions.student', 'name');
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET single assignment
router.get('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('course', 'courseCode courseName professor')
      .populate('submissions.student', 'name email');
    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

    // Check authorization: professor of the course, student enrolled, or admin
    const course = await Course.findById(assignment.course._id);
    if (!course) return res.status(404).json({ msg: 'Associated course not found' });

    const isProfessor = course.professor.toString() === req.user._id.toString();
    const isStudent = course.students.some(s => s.toString() === req.user._id.toString());

    if (!isProfessor && !isStudent && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    res.json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create assignment (professor of that course or admin)
router.post('/', auth, async (req, res) => {
  try {
    const { course: courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    if (course.professor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const newAssignment = new Assignment(req.body);
    const assignment = await newAssignment.save();
    res.json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT update assignment (professor of that course or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    let assignment = await Assignment.findById(req.params.id).populate('course');
    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

    const course = await Course.findById(assignment.course._id);
    if (!course) return res.status(404).json({ msg: 'Associated course not found' });

    if (course.professor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE assignment (professor of that course or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('course');
    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

    const course = await Course.findById(assignment.course._id);
    if (!course) return res.status(404).json({ msg: 'Associated course not found' });

    if (course.professor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Assignment removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST submit assignment (student)
router.post('/:id/submit', auth, role(['student']), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('course');
    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

    const course = await Course.findById(assignment.course._id);
    if (!course) return res.status(404).json({ msg: 'Associated course not found' });

    if (!course.students.some(s => s.toString() === req.user._id.toString())) {
      return res.status(403).json({ msg: 'You are not enrolled in this course' });
    }

    // Check if already submitted
    const existing = assignment.submissions.find(s => s.student.toString() === req.user._id.toString());
    if (existing) {
      return res.status(400).json({ msg: 'Already submitted' });
    }

    assignment.submissions.push({
      student: req.user._id,
      submittedAt: new Date(),
      fileUrl: req.body.fileUrl, // you'd get from file upload
    });
    await assignment.save();
    res.json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;