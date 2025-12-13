import express from 'express';
import Task from '../models/Task.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all tasks for authenticated user
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { type, item, village, time, endTime } = req.body;

    // Validation
    if (!type || !item || !village || !time || !endTime) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const task = new Task({
      userId: req.userId,
      type,
      item,
      village,
      time,
      endTime
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Error creating task' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

// Update a task (optional - for future use)
router.put('/:id', async (req, res) => {
  try {
    const { type, item, village, time, endTime } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { type, item, village, time, endTime },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
});

export default router;
