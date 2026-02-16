import express from 'express';
import Announcement from '../models/Announcement.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

// GET all announcements (filter by club if club user)
router.get('/', auth, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'club') {
      filter.club = req.user._id;
    }
    const announcements = await Announcement.find(filter)
      .populate('club', 'name')
      .populate('comments.user', 'name')
      .sort({ pinned: -1, createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create announcement (club or admin)
router.post('/', auth, role(['club', 'admin']), async (req, res) => {
  try {
    const newAnnouncement = new Announcement({
      ...req.body,
      club: req.user._id,
    });
    const announcement = await newAnnouncement.save();
    res.json(announcement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT update announcement (owner or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    let announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ msg: 'Announcement not found' });

    if (announcement.club.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(announcement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE announcement (owner or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ msg: 'Announcement not found' });

    if (announcement.club.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await announcement.deleteOne();
    res.json({ msg: 'Announcement removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST comment on announcement (any authenticated user)
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ msg: 'Announcement not found' });

    announcement.comments.push({
      user: req.user._id,
      text: req.body.text,
    });
    await announcement.save();
    await announcement.populate('comments.user', 'name');
    res.json(announcement.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;