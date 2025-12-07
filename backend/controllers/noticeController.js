const Notice = require('../models/Notice');

// CREATE NOTICE (Admin & Teacher)
exports.createNotice = async (req, res) => {
  if (!['admin', 'teacher'].includes(req.user.role))
    return res.status(403).json({ msg: "Not allowed" });

  const { title, description, startDate, endDate } = req.body;

  try {
    const notice = new Notice({
      title,
      description,
      startDate,
      endDate,
      postedBy: req.user._id
    });

    await notice.save();
    res.json({ success: true, notice });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// GET ACTIVE NOTICES (Everyone)
exports.getNotices = async (req, res) => {
  try {
    const now = new Date();

    const notices = await Notice.find({
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).populate("postedBy", "name role").sort({ createdAt: -1 });

    res.json(notices);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// UPDATE NOTICE
exports.updateNotice = async (req, res) => {
  if (!['admin', 'teacher'].includes(req.user.role))
    return res.status(403).json({ msg: "Not allowed" });

  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ msg: "Notice not found" });

    Object.assign(notice, req.body);
    await notice.save();

    res.json({ success: true, notice });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// DELETE NOTICE
exports.deleteNotice = async (req, res) => {
  if (!['admin', 'teacher'].includes(req.user.role))
    return res.status(403).json({ msg: "Not allowed" });

  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: "Notice deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
