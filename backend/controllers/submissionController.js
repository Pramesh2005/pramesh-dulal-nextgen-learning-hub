const Submission = require("../models/AssignmentSubmission");
const Assignment = require("../models/Assignment");
const User = require("../models/User");

const getTeacherSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.query;
    if (!assignmentId) {
      return res.status(400).json({ msg: "assignmentId is required" });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    // ✅ FIX: allow both STUDENT / student
    const students = await User.find({
      role: { $in: ["STUDENT", "student"] }
    }).select("name email");

    const submissions = await Submission.find({ assignment: assignmentId });

    const submissionMap = {};
    submissions.forEach(s => {
      submissionMap[s.student.toString()] = s;
    });

    const now = new Date();

    const result = students.map(student => {
      const submission = submissionMap[student._id.toString()];

      if (submission) {
        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          submission: {
            status: submission.status,
            fileUrl: submission.fileUrl,
            submittedAt: submission.submittedAt
          }
        };
      }

      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        submission: null,
        status: now > assignment.deadline ? "MISSED" : "PENDING"
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { getTeacherSubmissions };
