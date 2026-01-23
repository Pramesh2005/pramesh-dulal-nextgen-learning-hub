const Submission = require("../models/AssignmentSubmission");

const getSubmissions = async (req, res) => {
  try {
    const { subjectId, assignmentId } = req.query;

    let filter = {};
    if (subjectId) filter.subject = subjectId;
    if (assignmentId) filter.assignment = assignmentId;

    const submissions = await Submission.find(filter)
      .populate("assignment", "title deadline")
      .populate("subject", "name")
      .populate("student", "name email")
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { getSubmissions };
