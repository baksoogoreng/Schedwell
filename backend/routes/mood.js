const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const { protect } = require('../middleware/auth');

// @route   GET /api/moods
// @desc    Get all moods for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user._id }).sort({ date: -1 });
    res.json(moods);
  } catch (error) {
    console.error('Get moods error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/moods/today
// @desc    Get today's mood
// @access  Private
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mood = await Mood.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow }
    });

    res.json(mood);
  } catch (error) {
    console.error('Get today mood error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/moods
// @desc    Create/Update mood for today
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { mood, stressLevel, notes } = req.body;

    // Validation
    if (!mood || !stressLevel) {
      return res.status(400).json({ message: 'Please provide mood and stress level' });
    }

    if (mood < 1 || mood > 5 || stressLevel < 1 || stressLevel > 5) {
      return res.status(400).json({ message: 'Mood and stress level must be between 1 and 5' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if mood for today already exists
    let existingMood = await Mood.findOne({
      user: req.user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingMood) {
      // Update existing mood
      existingMood.mood = mood;
      existingMood.stressLevel = stressLevel;
      existingMood.notes = notes || '';
      await existingMood.save();
      return res.json(existingMood);
    }

    // Create new mood
    const newMood = await Mood.create({
      user: req.user._id,
      date: today,
      mood,
      stressLevel,
      notes: notes || ''
    });

    res.status(201).json(newMood);
  } catch (error) {
    console.error('Create mood error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/moods/week
// @desc    Get moods for the past week
// @access  Private
router.get('/week', protect, async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const moods = await Mood.find({
      user: req.user._id,
      date: { $gte: weekAgo }
    }).sort({ date: 1 });

    res.json(moods);
  } catch (error) {
    console.error('Get week moods error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;