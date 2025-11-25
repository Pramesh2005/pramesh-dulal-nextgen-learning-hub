const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'], 
    minlength: [3, 'Name must be at least 3 characters'],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [10, 'Password must be at least 10 characters']
  },
  role: { 
    type: String, 
    enum: ['student', 'teacher', 'admin'], 
    default: 'student' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'blocked'], 
    default: 'pending' 
  },
  avatar: { type: String, default: '' },
  xp: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);