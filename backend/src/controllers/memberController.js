import Gym from '../models/Gym.js';
import Membership from '../models/Membership.js';
import User from '../models/User.js';

// Join gym using code (gym member)
export const joinGym = async (req, res) => {
  try {
    const { gymCode, membershipType = 'monthly' } = req.body;
    const userId = req.userId;

    if (!gymCode) {
      return res.status(400).json({ message: 'Gym code is required' });
    }

    // Find gym by code
    const gym = await Gym.findOne({ gymCode: gymCode.toUpperCase() });
    if (!gym) {
      return res.status(404).json({ message: 'Invalid gym code' });
    }

    // Check if already member
    const existingMembership = await Membership.findOne({
      member: userId,
      gym: gym._id,
      isActive: true,
    });

    if (existingMembership) {
      return res.status(400).json({ message: 'Already a member of this gym' });
    }

    // Determine price and end date
    let price, endDate;
    const today = new Date();

    if (membershipType === 'monthly') {
      price = gym.monthlyFee;
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    } else if (membershipType === 'quarterly') {
      price = (gym.monthlyFee * 3) * 0.9; // 10% discount
      endDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
    } else if (membershipType === 'annual') {
      price = (gym.monthlyFee * 12) * 0.85; // 15% discount
      endDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    }

    // Create membership
    const membership = new Membership({
      member: userId,
      gym: gym._id,
      membershipType,
      price,
      endDate,
      isPaid: false,
      isActive: true,
    });

    await membership.save();

    // Update gym member count
    gym.totalMembers = (gym.totalMembers || 0) + 1;
    await gym.save();

    // Populate membership with gym and user data
    const populatedMembership = await Membership.findById(membership._id)
      .populate('gym')
      .populate('member', 'name email phone');

    res.status(201).json({
      message: 'Successfully joined gym',
      membership: {
        _id: populatedMembership._id,
        membershipType: populatedMembership.membershipType,
        price: populatedMembership.price,
        endDate: populatedMembership.endDate,
        isPaid: populatedMembership.isPaid,
        isActive: populatedMembership.isActive,
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
      },
    });
  } catch (error) {
    console.error('Join gym error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get member's membership
export const getMembership = async (req, res) => {
  try {
    const userId = req.userId;

    const membership = await Membership.findOne({
      member: userId,
      isActive: true,
    }).populate('gym').populate('member', 'name email phone');

    if (!membership) {
      return res.status(404).json({ message: 'No active membership found' });
    }

    // Calculate days remaining
    const today = new Date();
    const daysRemaining = Math.ceil((membership.endDate - today) / (1000 * 60 * 60 * 24));

    res.status(200).json({
      membership: {
        _id: membership._id,
        membershipType: membership.membershipType,
        price: membership.price,
        startDate: membership.startDate,
        endDate: membership.endDate,
        isPaid: membership.isPaid,
        isActive: membership.isActive,
        daysRemaining,
        gym: {
          _id: membership.gym._id,
          gymName: membership.gym.gymName,
          description: membership.gym.description,
          address: membership.gym.address,
          city: membership.gym.city,
          facilities: membership.gym.facilities,
          openingTime: membership.gym.openingTime,
          closingTime: membership.gym.closingTime,
        },
        user: {
          _id: membership.member._id,
          name: membership.member.name,
          email: membership.member.email,
          phone: membership.member.phone,
        },
      },
    });
  } catch (error) {
    console.error('Get membership error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all members of a gym (admin only)
export const getAllMembers = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { status = 'active' } = req.query;

    let query = { gym: gymId };
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'expired') {
      query.isActive = false;
    }

    const members = await Membership.find(query)
      .populate('member', 'name email phone profileImage')
      .populate('gym', 'gymName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: members.length,
      members,
    });
  } catch (error) {
    console.error('Get all members error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Remove member (gym owner only)
export const removeMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    const membership = await Membership.findByIdAndDelete(memberId);
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    // Update gym member count
    await Gym.findByIdAndUpdate(membership.gym, {
      $inc: { totalMembers: -1 },
    });

    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update membership details (gym owner only)
export const updateMembership = async (req, res) => {
  try {
    const { memberId } = req.params; // membership document id
    const updates = req.body; // membershipType, expiryDate, isActive, isPaid

    const membership = await Membership.findByIdAndUpdate(memberId, updates, { new: true })
      .populate('member', 'name email phone')
      .populate('gym', 'gymName');

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    res.status(200).json({ message: 'Membership updated', membership });
  } catch (error) {
    console.error('Update membership error:', error);
    res.status(500).json({ message: error.message });
  }
};
