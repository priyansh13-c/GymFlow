import User from '../models/User.js';
import Gym from '../models/Gym.js';
import Membership from '../models/Membership.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/tokenUtils.js';

// Register new user
export const register = async (req, res) => {
  try {
    const { name, username, email, password, role = 'gym_member' } = req.body;

    // Validate required fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields: name, username, email, password' });
    }

    // Check if user exists by email or username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return res.status(400).json({ message: `${field} already registered` });
    }

    // Create new user
    const user = new User({
      name,
      username,
      email,
      password,
      role,
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get gym if user is a member
    let gymId = null;
    if (user.role === 'gym_member') {
      const membership = await Membership.findOne({
        member: user._id,
        isActive: true,
      }).populate('gym');
      gymId = membership?.gym?._id;
    } else if (user.role === 'gym_owner') {
      const gym = await Gym.findOne({ owner: user._id });
      gymId = gym?._id;
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role, gymId);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshTokens = [...(user.refreshTokens || []), refreshToken];
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Check if token exists in DB
    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ message: 'Token not found or revoked' });
    }

    // Get gym info
    let gymId = null;
    if (user.role === 'gym_member') {
      const membership = await Membership.findOne({
        member: user._id,
        isActive: true,
      }).populate('gym');
      gymId = membership?.gym?._id;
    } else if (user.role === 'gym_owner') {
      const gym = await Gym.findOne({ owner: user._id });
      gymId = gym?._id;
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id, user.role, gymId);

    res.status(200).json({
      message: 'Token refreshed',
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.userId;

    // Remove refresh token from DB
    if (refreshToken) {
      await User.findByIdAndUpdate(userId, {
        $pull: { refreshTokens: refreshToken },
      });
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -refreshTokens');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ 
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    const { name, phone, profileImage } = req.body;
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (profileImage) updates.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password -refreshTokens');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message });
  }
};
