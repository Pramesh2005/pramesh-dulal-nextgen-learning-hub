const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const uploadAssignment = require("../middleware/assignmentUpload");

const Assignment = require("../models/Assignment");
const Submission = require("../models/AssignmentSubmission");
const { getTeacherSubmissions } = require("../controllers/submissionController");

//  Student submits assignment
router.post(
  "/student",
  protect,
  uploadAssignment.single("file"),
  async (req, res) => {
    try {
      const { assignmentId } = req.body;

      console.log("REQ.BODY:", req.body);
      console.log("REQ.FILE:", req.file);

      if (!req.file) {
        return res.status(400).json({ msg: "File required" });
      }

      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        return res.status(400).json({ msg: "Assignment not found" });
      }

      if (!assignment.isOpen) {
        return res.status(400).json({ msg: "Assignment is closed" });
      }

      // Check if already submitted
      const existing = await Submission.findOne({
        assignment: assignmentId,
        student: req.user._id,
      });

      if (existing) {
        return res.status(400).json({ msg: "Already submitted" });
      }

      // Determine status
      const status =
        new Date() > new Date(assignment.deadline) ? "MISSED" : "COMPLETED";

      const submission = await Submission.create({
        assignment: assignmentId,
        subject: assignment.subject,
        student: req.user._id,
        studentName: req.user.name,
        fileUrl: `/uploads/assignments/${req.file.filename}`,
        status,
      });

      res.json({ success: true, submission });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: err.message });
    }
  }
);

//  Get all submissions (teacher/admin view)
router.get("/", protect, async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("assignment", "title deadline")
      .populate("subject", "name")
      .populate("student", "name email");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get a single submission for a student by assignment

router.get("/student/:assignmentId", protect, async (req, res) => {
  try {
    const submission = await Submission.findOne({
      assignment: req.params.assignmentId,
      student: req.user._id,
    });

    
    res.json(submission || null);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete submission by student
router.delete("/student/:submissionId", protect, async (req, res) => {
  try {
    const submission = await Submission.findOne({
      _id: req.params.submissionId,
      student: req.user._id,
    });

    if (!submission) return res.status(404).json({ msg: "Submission not found" });

    await submission.deleteOne();

    res.json({ success: true, msg: "Submission deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
// Teacher view - all students submissions for assignment
router.get("/teacher", protect, getTeacherSubmissions);

module.exports = router;
