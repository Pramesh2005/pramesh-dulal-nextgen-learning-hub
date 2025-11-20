const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student'
    });

    // Auto admin
    if (email === 'admin@nextgen.com') {
      user.role = 'admin';
      user.status = 'active';
    }

    await user.save();

    res.json({ success: true, msg: 'Registration successful! Wait for approval.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (user.status === 'pending') {
      return res.status(403).json({ msg: 'Your account is pending admin approval' });
    }
    if (user.status === 'blocked') {
      return res.status(403).json({ msg: 'Your account has been blocked by admin' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ msg: 'Account not active. Contact admin.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ user: { name: user.name, email: user.email, role: user.role } });
};



module.exports = { register, login, getMe };