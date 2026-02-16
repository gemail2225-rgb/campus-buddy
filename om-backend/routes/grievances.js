import express from 'express';
import Grievance from '../models/Grievance.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

// GET all grievances
// Students: their own grievances
// Admin/Coordinator: all grievances
router.get('/', auth, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'student') {
      filter.createdBy = req.user._id;
    }
    // Admin and staff can see all grievances
    
    const grievances = await Grievance.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name')
      .populate('updates.updatedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json(grievances);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET single grievance
router.get('/:id', auth, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name')
      .populate('updates.updatedBy', 'name');
    
    if (!grievance) return res.status(404).json({ msg: 'Grievance not found' });

    // Authorization: creator, assigned staff, or admin
    if (grievance.createdBy._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && 
        req.user.role !== 'staff') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    res.json(grievance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create a new grievance (students)
router.post('/', auth, role(['student']), async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    const newGrievance = new Grievance({
      title,
      description,
      category,
      priority: priority || 'medium',
      createdBy: req.user._id
    });

    const grievance = await newGrievance.save();
    await grievance.populate('createdBy', 'name email');

    res.status(201).json(grievance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT update grievance status and add comment (admin/staff)
router.put('/:id', auth, role(['admin', 'staff']), async (req, res) => {
  try {
    const { status, comment, assignTo } = req.body;
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) return res.status(404).json({ msg: 'Grievance not found' });

    if (status) {
      grievance.status = status;
    }

    if (assignTo) {
      grievance.assignedTo = assignTo;
    }

    if (comment) {
      grievance.updates.push({
        comment,
        updatedBy: req.user._id,
        status: status || grievance.status
      });
    }

    await grievance.save();
    await grievance.populate('createdBy', 'name email');
    await grievance.populate('assignedTo', 'name');
    await grievance.populate('updates.updatedBy', 'name');

    res.json(grievance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT add comment to grievance (student or admin/staff)
router.put('/:id/comment', auth, async (req, res) => {
  try {
    const { comment } = req.body;
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) return res.status(404).json({ msg: 'Grievance not found' });

    // Authorization: creator or staff
    if (grievance.createdBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && 
        req.user.role !== 'staff') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    grievance.updates.push({
      comment,
      updatedBy: req.user._id,
      status: grievance.status
    });

    await grievance.save();
    await grievance.populate('createdBy', 'name email');
    await grievance.populate('assignedTo', 'name');
    await grievance.populate('updates.updatedBy', 'name');

    res.json(grievance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE grievance (creator or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) return res.status(404).json({ msg: 'Grievance not found' });

    if (grievance.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await Grievance.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Grievance deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
