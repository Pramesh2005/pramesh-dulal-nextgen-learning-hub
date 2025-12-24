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
      user: updatedUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
const updateNickname = async (req, res) => {
  try {
    const { nickname } = req.body;

    //  Validate
    if (!nickname || !nickname.trim()) {
      return res.status(400).json({ msg: "Nickname is required" });
    }

    const cleanNickname = nickname.trim();

    if (cleanNickname.length < 3 || cleanNickname.length > 20) {
      return res.status(400).json({ msg: "Nickname must be 3–20 characters long" });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanNickname)) {
      return res.status(400).json({ msg: "Nickname can contain only letters, numbers, and _" });
    }

    //  Cooldown 
    if (req.user.nicknameUpdatedAt) {
      const hoursPassed =
        (Date.now() - new Date(req.user.nicknameUpdatedAt)) / (1000 * 60 * 60);

      if (hoursPassed < 24) {
        return res.status(400).json({
          msg: "You can change nickname only once every 24 hours",
        });
      }
    }

    // Check uniqueness
    const exists = await User.findOne({ nickname: cleanNickname });
    if (exists && exists._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ msg: "Nickname already taken" });
    }

    // Update
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        nickname: cleanNickname,
        nicknameUpdatedAt: new Date(),
      },
      { new: true }
    ).select("-password");

    res.json({
  success: true,
  user: updatedUser, 
});

  } catch (err) {
    console.error("Update nickname error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


module.exports = { getAllUsers, approveUser, rejectUser, updateAvatar, updateNickname};
