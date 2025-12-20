const User = require("../models/User");
const { protect, admin } = require("../middleware/auth");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const approveUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: "active" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const rejectUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: "blocked" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    const avatarUrl = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    );

    res.json({ 
      success: true, 
      avatar: avatarUrl 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { getAllUsers, approveUser, rejectUser, updateAvatar };
