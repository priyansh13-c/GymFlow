import Gym from '../models/Gym.js';
import Membership from '../models/Membership.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import { generateGymCode } from '../utils/tokenUtils.js';

// Get owner's gym
export const getOwnerGyms = async (req, res) => {
  try {
    const gym = await Gym.findOne({ owner: req.userId }).populate('owner', 'name email');
    
    if (!gym) {
      return res.status(200).json({ gym: null });
    }

    // Get active members count
    const activeMembers = await Membership.countDocuments({
      gym: gym._id,
      isActive: true,
    });

    // count trainers directly to ensure accuracy
    const Trainer = await import('./../models/Trainer.js');
    const totalTrainers = await Trainer.default.countDocuments({ gym: gym._id, isActive: true });

    res.status(200).json({
      gym: {
        _id: gym._id,
        gymName: gym.gymName,
        gymCode: gym.gymCode,
        description: gym.description,
        address: gym.address,
        city: gym.city,
        monthlyFee: gym.monthlyFee,
        annualFee: gym.annualFee,
        facilities: gym.facilities,
        openingTime: gym.openingTime,
        closingTime: gym.closingTime,
        totalMembers: activeMembers,
        totalTrainers,
      },
    });
  } catch (error) {
    console.error('Get owner gyms error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create gym (gym owner only)
export const createGym = async (req, res) => {
  try {
    const { gymName, description, address, city, state, zipCode, phone, email, monthlyFee, annualFee, facilities, openingTime, closingTime } = req.body;

    // Check if owner already has a gym
    const existingGym = await Gym.findOne({ owner: req.userId });
    if (existingGym) {
      return res.status(400).json({ message: 'You already have a gym. Update it or delete it first.' });
    }

    // Check if gym name already exists
    const gymNameExists = await Gym.findOne({ gymName });
    if (gymNameExists) {
      return res.status(400).json({ message: 'Gym name already exists' });
    }

    // Generate unique gym code
    let gymCode;
    let codeExists = true;
    while (codeExists) {
      gymCode = generateGymCode();
      codeExists = await Gym.findOne({ gymCode });
    }

    const gym = new Gym({
      owner: req.userId,
      gymName,
      description,
      address,
      city,
      state,
      zipCode,
      phone,
      email,
      monthlyFee,
      annualFee,
      facilities,
      openingTime,
      closingTime,
      gymCode,
    });

    await gym.save();

    res.status(201).json({
      message: 'Gym created successfully',
      gym: {
        _id: gym._id,
        gymName: gym.gymName,
        gymCode: gym.gymCode,
        description: gym.description,
        address: gym.address,
        city: gym.city,
        monthlyFee: gym.monthlyFee,
        annualFee: gym.annualFee,
        facilities: gym.facilities,
        openingTime: gym.openingTime,
        closingTime: gym.closingTime,
      },
    });
  } catch (error) {
    console.error('Create gym error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get gym details
export const getGym = async (req, res) => {
  try {
    const { gymId } = req.params;

    const gym = await Gym.findById(gymId).populate('owner', 'name email');
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }

    res.status(200).json({ gym });
  } catch (error) {
    console.error('Get gym error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get gym members (gym owner only)
export const getGymMembers = async (req, res) => {
  try {
    const { gymId } = req.params;

    const members = await Membership.find({
      gym: gymId,
      isActive: true,
    }).populate('member', 'name email phone');

    res.status(200).json({
      count: members.length,
      members,
    });
  } catch (error) {
    console.error('Get gym members error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update gym
export const updateGym = async (req, res) => {
  try {
    const { gymId } = req.params;
    const updates = req.body;

    const gym = await Gym.findByIdAndUpdate(gymId, updates, { new: true });

    res.status(200).json({
      message: 'Gym updated successfully',
      gym,
    });
  } catch (error) {
    console.error('Update gym error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get gym stats (gym owner dashboard)
export const getGymStats = async (req, res) => {
  try {
    const { gymId } = req.params;

    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }

    // Get active members
    const activeMembers = await Membership.countDocuments({
      gym: gymId,
      isActive: true,
    });

    // Get total payments
    const totalRevenue = await Payment.aggregate([
      { $match: { gym: gymId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Get pending payments
    const pendingPayments = await Payment.countDocuments({
      gym: gymId,
      status: 'pending',
    });

    res.status(200).json({
      stats: {
        activeMembers,
        totalMembers: gym.totalMembers,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingPayments,
        gymCode: gym.gymCode,
      },
    });
  } catch (error) {
    console.error('Get gym stats error:', error);
    res.status(500).json({ message: error.message });
  }
};
