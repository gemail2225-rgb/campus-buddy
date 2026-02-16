import express from 'express';
import ResearchInternship from '../models/ResearchInternship.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

// GET all research internships
// For professors: only their own posts
// For admin: all posts
// For students: all posts (or we can filter later)
router.get('/', auth, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'professor') {
      filter.professor = req.user._id;
    }
    // For admin and student, no filter (show all)
    const posts = await ResearchInternship.find(filter)
      .populate('professor', 'name')
      .populate('applicants.student', 'name email');
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET a single research internship
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await ResearchInternship.findById(req.params.id)
      .populate('professor', 'name')
      .populate('applicants.student', 'name email');
    if (!post) return res.status(404).json({ msg: 'Research internship not found' });

    // Authorization: professor who owns it, admin, or any student (if we want)
    // For now, allow professors and admins only
    if (post.professor._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create a new research internship (professor or admin)
router.post('/', auth, role(['professor', 'admin']), async (req, res) => {
  try {
    const newPost = new ResearchInternship({
      ...req.body,
      professor: req.user._id, // automatically set to current user
    });
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT update a research internship (owner or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    let post = await ResearchInternship.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Research internship not found' });

    if (post.professor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    post = await ResearchInternship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE a research internship (owner or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await ResearchInternship.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Research internship not found' });

    if (post.professor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ msg: 'Research internship removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET applicants for a specific research internship (owner or admin)
router.get('/:id/applicants', auth, async (req, res) => {
  try {
    const post = await ResearchInternship.findById(req.params.id)
      .populate('applicants.student', 'name email');
    if (!post) return res.status(404).json({ msg: 'Research internship not found' });

    if (post.professor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    res.json(post.applicants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PATCH update applicant status (owner or admin)
router.patch('/:id/applicants/:applicantId', auth, async (req, res) => {
  try {
    const { status } = req.body; // expected 'accepted' or 'rejected'
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const post = await ResearchInternship.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Research internship not found' });

    if (post.professor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const applicant = post.applicants.id(req.params.applicantId);
    if (!applicant) return res.status(404).json({ msg: 'Applicant not found' });

    applicant.status = status;
    await post.save();

    res.json({ msg: `Applicant ${status}`, applicant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST student apply for research internship
router.post('/:id/apply', auth, role(['student']), async (req, res) => {
  try {
    const post = await ResearchInternship.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Research internship not found' });

    // Check if student has already applied
    const alreadyApplied = post.applicants.some(app => 
      app.student.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ msg: 'You have already applied for this internship' });
    }

    // Add student to applicants array
    post.applicants.push({
      student: req.user._id,
      status: 'pending'
    });

    await post.save();
    await post.populate('professor', 'name');
    await post.populate('applicants.student', 'name email');

    res.status(201).json({ msg: 'Application submitted successfully', post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET student's research applications
router.get('/student/applications/my', auth, role(['student']), async (req, res) => {
  try {
    const posts = await ResearchInternship.find({
      'applicants.student': req.user._id
    })
      .populate('professor', 'name email')
      .populate('applicants.student', 'name email');

    // Extract only this student's application status
    const applications = posts.map(post => ({
      _id: post._id,
      title: post.title,
      description: post.description,
      professor: post.professor,
      duration: post.duration,
      stipend: post.stipend,
      requiredSkills: post.requiredSkills,
      deadline: post.deadline,
      createdAt: post.createdAt,
      application: post.applicants.find(app => app.student._id.toString() === req.user._id.toString())
    }));

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE student's application (withdraw)
router.delete('/:id/apply', auth, role(['student']), async (req, res) => {
  try {
    const post = await ResearchInternship.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Research internship not found' });

    const applicantIndex = post.applicants.findIndex(app => 
      app.student.toString() === req.user._id.toString()
    );

    if (applicantIndex === -1) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    // Only allow withdrawal if status is pending
    if (post.applicants[applicantIndex].status !== 'pending') {
      return res.status(400).json({ msg: 'Cannot withdraw a non-pending application' });
    }

    post.applicants.splice(applicantIndex, 1);
    await post.save();

    res.json({ msg: 'Application withdrawn' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;