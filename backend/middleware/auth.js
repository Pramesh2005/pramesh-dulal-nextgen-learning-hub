const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async(req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // fetch full user
    if (!user) return res.status(401).json({ msg: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const admin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin access only' });
  next();
};

module.exports = { protect, admin };