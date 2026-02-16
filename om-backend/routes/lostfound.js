import express from 'express';
import LostFoundItem from '../models/LostFoundItem.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

// GET all lost/found items
// Filter by type (lost/found) and status
router.get('/', auth, async (req, res) => {
  try {
    const { type, status, category } = req.query;
    let filter = { status: { $ne: 'closed' } }; // by default, show active and resolved

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (category) filter.category = category;

    const items = await LostFoundItem.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET items posted by user
router.get('/user/posted', auth, role(['student']), async (req, res) => {
  try {
    const items = await LostFoundItem.find({ postedBy: req.user._id })
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET single lost/found item
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id)
      .populate('postedBy', 'name email')
      .populate('matchedWith');

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create a new lost/found item (students)
router.post('/', auth, role(['student']), async (req, res) => {
  try {
    const { title, description, type, location, category, dateOfIncident, contact, imageUrl } = req.body;

    if (!title || !description || !type || !location || !category) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({ msg: 'Invalid type. Must be "lost" or "found"' });
    }

    const newItem = new LostFoundItem({
      title,
      description,
      type,
      location,
      category,
      dateOfIncident: dateOfIncident || new Date(),
      contact: {
        email: contact?.email || req.user.email,
        phone: contact?.phone
      },
      postedBy: req.user._id,
      imageUrl
    });

    const item = await newItem.save();
    await item.populate('postedBy', 'name email');

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT update lost/found item (poster or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    // Authorization: poster or admin
    if (item.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const { title, description, status, contact, imageUrl, matchedWith } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (status) item.status = status;
    if (contact) item.contact = { ...item.contact, ...contact };
    if (imageUrl) item.imageUrl = imageUrl;
    if (matchedWith) item.matchedWith = matchedWith;

    await item.save();
    await item.populate('postedBy', 'name email');
    await item.populate('matchedWith');

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE lost/found item (poster or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    if (item.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await LostFoundItem.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT mark as resolved and match with another item
router.put('/:id/match', auth, async (req, res) => {
  try {
    const { matchedItemId } = req.body;
    const item = await LostFoundItem.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    if (item.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    if (matchedItemId) {
      item.matchedWith = matchedItemId;
      item.status = 'resolved';
    }

    await item.save();
    await item.populate('postedBy', 'name email');
    await item.populate('matchedWith');

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
