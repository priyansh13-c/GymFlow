import WorkoutLog from '../models/WorkoutLog.js';
import Membership from '../models/Membership.js';

// Add workout log
export const addWorkout = async (req, res) => {
  try {
    const { date, exercises } = req.body;
    const userId = req.userId;

    // Get user's active membership to determine gym
    const membership = await Membership.findOne({
      member: userId,
      isActive: true,
    });

    if (!membership) {
      return res.status(400).json({ message: 'You must join a gym first' });
    }

    const workout = new WorkoutLog({
      member: userId,
      gym: membership.gym,
      date: date || new Date(),
      exercises,
    });

    await workout.save();

    res.status(201).json({
      message: 'Workout logged successfully',
      workout,
    });
  } catch (error) {
    console.error('Add workout error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's workouts
export const getUserWorkouts = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    // Get user's membership to determine gym
    const membership = await Membership.findOne({
      member: userId,
      isActive: true,
    });

    if (!membership) {
      return res.status(400).json({ message: 'You must join a gym first' });
    }

    let query = {
      member: userId,
      gym: membership.gym,
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const workouts = await WorkoutLog.find(query).sort({ date: -1 });

    res.status(200).json({
      count: workouts.length,
      workouts,
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all gym members' workouts (admin only)
export const getGymWorkouts = async (req, res) => {
  try {
    const { gymId } = req.params;

    const workouts = await WorkoutLog.find({ gym: gymId })
      .populate('member', 'name email')
      .sort({ date: -1 });

    res.status(200).json({
      count: workouts.length,
      workouts,
    });
  } catch (error) {
    console.error('Get gym workouts error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update workout
export const updateWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const updates = req.body;

    const workout = await WorkoutLog.findByIdAndUpdate(workoutId, updates, { new: true });
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.status(200).json({
      message: 'Workout updated',
      workout,
    });
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete workout
export const deleteWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;

    await WorkoutLog.findByIdAndDelete(workoutId);

    res.status(200).json({ message: 'Workout deleted' });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ message: error.message });
  }
};
