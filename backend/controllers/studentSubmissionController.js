const Assignment = require("../models/Assignment");
const Submission = require("../models/AssignmentSubmission");

const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "File required" });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment || !assignment.isOpen) {
      return res.status(400).json({ msg: "Assignment is closed" });
    }

    const existing = await Submission.findOne({
      assignment: assignmentId,
      student: req.user._id
    });

    if (existing) {
      return res.status(400).json({ msg: "Already submitted" });
    }

    const status =
      new Date() > new Date(assignment.deadline)
        ? "MISSED"
        : "COMPLETED";

    const submission = await Submission.create({
      assignment: assignmentId,
      subject: assignment.subject,
      student: req.user._id,
      studentName: req.user.name,
      fileUrl: `/uploads/assignments/${req.file.filename}`,
      status
    });

    res.json({ success: true, submission });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { submitAssignment };
