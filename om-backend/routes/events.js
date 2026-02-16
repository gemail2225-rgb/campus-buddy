import express from 'express';
import Event from '../models/Event.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'club') {
      filter.club = req.user._id;
    }
    const events = await Event.find(filter).populate('club', 'name').sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/', auth, role(['club', 'admin']), async (req, res) => {
  try {
    const newEvent = new Event({
      ...req.body,
      club: req.user._id,
    });
    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    if (event.club.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    if (event.club.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await event.deleteOne();
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/:id/register', auth, role(['student']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // Check if student already registered
    const alreadyRegistered = event.registeredStudents.some(reg => 
      reg.student.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ msg: 'You are already registered for this event' });
    }

    // Check max participants
    if (event.max && event.registeredCount >= event.max) {
      return res.status(400).json({ msg: 'Event is full' });
    }

    // Add student to registered list
    event.registeredStudents.push({
      student: req.user._id
    });
    event.registeredCount += 1;
    
    await event.save();
    await event.populate('club', 'name');
    await event.populate('registeredStudents.student', 'name email');
    
    res.json({ msg: 'Registered successfully', event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT unregister student from event
router.put('/:id/unregister', auth, role(['student']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // Find and remove student from registered list
    const studentIndex = event.registeredStudents.findIndex(reg =>
      reg.student.toString() === req.user._id.toString()
    );

    if (studentIndex === -1) {
      return res.status(400).json({ msg: 'You are not registered for this event' });
    }

    event.registeredStudents.splice(studentIndex, 1);
    event.registeredCount = Math.max(0, event.registeredCount - 1);
    
    await event.save();
    await event.populate('club', 'name');
    
    res.json({ msg: 'Unregistered successfully', event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET check if student is registered for event
router.get('/:id/check-registration', auth, role(['student']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    const isRegistered = event.registeredStudents.some(reg =>
      reg.student.toString() === req.user._id.toString()
    );

    res.json({ isRegistered });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;