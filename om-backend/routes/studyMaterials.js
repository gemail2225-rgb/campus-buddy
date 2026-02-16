import express from 'express';
import StudyMaterial from '../models/StudyMaterial.js';
import Course from '../models/Course.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

// GET all study materials (filter by user's courses)
router.get('/', auth, async (req, res) => {
  try {
    let courseIds = [];
    if (req.user.role === 'professor') {
      const courses = await Course.find({ professor: req.user._id }).select('_id');
      courseIds = courses.map(c => c._id);
    } else if (req.user.role === 'student') {
      const courses = await Course.find({ students: req.user._id }).select('_id');
      courseIds = courses.map(c => c._id);
    }
    let filter = {};
    if (courseIds.length > 0) {
      filter.course = { $in: courseIds };
    } else if (req.user.role !== 'admin') {
      return res.json([]);
    }
    const materials = await StudyMaterial.find(filter)
      .populate('course', 'courseCode courseName')
      .populate('uploadedBy', 'name');
    res.json(materials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET single study material
router.get('/:id', auth, async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id)
      .populate('course', 'courseCode courseName professor')
      .populate('uploadedBy', 'name');
    if (!material) return res.status(404).json({ msg: 'Material not found' });

    const course = await Course.findById(material.course._id);
    if (!course) return res.status(404).json({ msg: 'Associated course not found' });

    const isProfessor = course.professor.toString() === req.user._id.toString();
    const isStudent = course.students.some(s => s.toString() === req.user._id.toString());

    if (!isProfessor && !isStudent && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    res.json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create study material (professor of that course or admin)
router.post('/', auth, async (req, res) => {
  try {
    const { course: courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    if (course.professor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const newMaterial = new StudyMaterial({
      ...req.body,
      uploadedBy: req.user._id,
    });
    const material = await newMaterial.save();
    res.json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE study material (professor of that course or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id).populate('course');
    if (!material) return res.status(404).json({ msg: 'Material not found' });

    const course = await Course.findById(material.course._id);
    if (!course) return res.status(404).json({ msg: 'Associated course not found' });

    if (course.professor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await StudyMaterial.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Material removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;