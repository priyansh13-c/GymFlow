import Trainer from '../models/Trainer.js';
import TrainerBooking from '../models/TrainerBooking.js';

// Get available trainers for gym
export const getTrainers = async (req, res) => {
  try {
    // allow gymId from params or from token
    const gymIdParam = req.params.gymId || req.gymId;
    const { specialization } = req.query;

    let query = { gym: gymIdParam, isActive: true };

    if (specialization) {
      query.specialization = specialization;
    }

    const trainers = await Trainer.find(query).populate('user', 'name email phone');

    res.status(200).json({
      count: trainers.length,
      trainers,
    });
  } catch (error) {
    console.error('Get trainers error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Book trainer (member)
export const bookTrainer = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const { bookingDate, startTime, endTime, duration, notes } = req.body;

    // Check trainer exists
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    const gymId = req.gymId; // from token

    // Create booking
    const booking = new TrainerBooking({
      member: req.userId,
      trainer: trainerId,
      gym: gymId,
      bookingDate,
      startTime,
      endTime,
      duration,
      notes,
      status: 'pending',
    });

    await booking.save();

    res.status(201).json({
      message: 'Trainer booking request sent',
      booking,
    });
  } catch (error) {
    console.error('Book trainer error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const gymId = req.gymId;

    const bookings = await TrainerBooking.find({
      member: req.userId,
      gym: gymId,
    })
      .populate('trainer', 'specialization hourlyRate')
      .sort({ bookingDate: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get trainer's bookings (trainer only)
export const getTrainerBookings = async (req, res) => {
  try {
    const { trainerId } = req.params;

    const bookings = await TrainerBooking.find({ trainer: trainerId })
      .populate('member', 'name email phone')
      .sort({ bookingDate: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Get trainer bookings error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Confirm booking (trainer)
export const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await TrainerBooking.findByIdAndUpdate(
      bookingId,
      { status: 'confirmed' },
      { new: true }
    );

    res.status(200).json({
      message: 'Booking confirmed',
      booking,
    });
  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    await TrainerBooking.findByIdAndUpdate(bookingId, { status: 'cancelled' });

    res.status(200).json({ message: 'Booking cancelled' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Owner: create a trainer
export const createTrainer = async (req, res) => {
  try {
    const gymId = req.gymId;
    const { specialization, experience, qualification, hourlyRate, bio, availableSlots } = req.body;

    const trainer = new Trainer({
      gym: gymId,
      specialization,
      experience,
      qualification,
      hourlyRate,
      bio,
      availableSlots,
    });

    await trainer.save();

    // increment gym trainer count if field exists
    const Gym = await import('../models/Gym.js');
    await Gym.default.findByIdAndUpdate(gymId, { $inc: { totalTrainers: 1 } });

    res.status(201).json({ message: 'Trainer created', trainer });
  } catch (error) {
    console.error('Create trainer error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Owner: update a trainer
export const updateTrainer = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const updates = req.body;

    const trainer = await Trainer.findByIdAndUpdate(trainerId, updates, { new: true });
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    res.status(200).json({ message: 'Trainer updated', trainer });
  } catch (error) {
    console.error('Update trainer error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Owner: delete a trainer
export const deleteTrainer = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const deleted = await Trainer.findByIdAndDelete(trainerId);
    if (deleted) {
      const Gym = await import('../models/Gym.js');
      await Gym.default.findByIdAndUpdate(deleted.gym, { $inc: { totalTrainers: -1 } });
    }
    res.status(200).json({ message: 'Trainer deleted' });
  } catch (error) {
    console.error('Delete trainer error:', error);
    res.status(500).json({ message: error.message });
  }
};
