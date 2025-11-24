const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const { protect } = require('../middleware/auth');

// @route   GET /api/schedules
// @desc    Get all schedules for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const schedules = await Schedule.find({ user: req.user._id }).sort({ day: 1, startTime: 1 });
    res.json(schedules);
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/schedules/:id
// @desc    Get single schedule
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check ownership
    if (schedule.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(schedule);
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/schedules
// @desc    Create schedule
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, type, day, startTime, endTime, description, location, color } = req.body;

    // Validation
    if (!title || !type || !day || !startTime || !endTime) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check for overlap
    const existingSchedules = await Schedule.find({
      user: req.user._id,
      day: day
    });

    const hasOverlap = existingSchedules.some(schedule => {
      return (
        (startTime >= schedule.startTime && startTime < schedule.endTime) ||
        (endTime > schedule.startTime && endTime <= schedule.endTime) ||
        (startTime <= schedule.startTime && endTime >= schedule.endTime)
      );
    });

    if (hasOverlap) {
      return res.status(400).json({ 
        message: 'Schedule overlaps with existing schedule',
        warning: true
      });
    }

    const schedule = await Schedule.create({
      user: req.user._id,
      title,
      type,
      day,
      startTime,
      endTime,
      description,
      location,
      color
    });

    res.status(201).json(schedule);
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/schedules/:id
// @desc    Update schedule
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check ownership
    if (schedule.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(schedule);
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/schedules/:id
// @desc    Delete schedule
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check ownership
    if (schedule.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await schedule.deleteOne();

    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;