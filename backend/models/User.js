const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  status: { type: String, enum: ['pending', 'active', 'blocked'], default: 'pending' },
  avatar: { type: String, default: '' },
  xp: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);