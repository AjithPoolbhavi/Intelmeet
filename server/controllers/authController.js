const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory store for mock mode (when MongoDB is not available)
const mockUsers = new Map();

let User;
try {
  User = require('../models/User');
} catch (e) {}

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'intellmeet_secret', { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    // Try MongoDB first
    if (User) {
      try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already registered' });
        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);
        return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
      } catch (dbErr) {
        console.log('DB error, using mock mode');
      }
    }

    // Mock mode
    if (mockUsers.has(email)) return res.status(400).json({ message: 'Email already registered' });
    const id = Date.now().toString();
    const hashedPassword = await bcrypt.hash(password, 12);
    const mockUser = { id, name, email, password: hashedPassword };
    mockUsers.set(email, mockUser);
    const token = generateToken(id);
    res.status(201).json({ token, user: { id, name, email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    // Try MongoDB first
    if (User) {
      try {
        const user = await User.findOne({ email });
        if (user) {
          const isMatch = await user.comparePassword(password);
          if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
          const token = generateToken(user._id);
          return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
        }
      } catch (dbErr) {
        console.log('DB error, using mock mode');
      }
    }

    // Mock mode
    const mockUser = mockUsers.get(email);
    if (!mockUser) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, mockUser.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = generateToken(mockUser.id);
    res.json({ token, user: { id: mockUser.id, name: mockUser.name, email: mockUser.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    if (User) {
      try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) return res.json({ user: { id: user._id, name: user.name, email: user.email } });
      } catch (e) {}
    }
    // Mock fallback
    res.json({ user: { id: req.user.id, name: 'User', email: 'user@intellmeet.com' } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
