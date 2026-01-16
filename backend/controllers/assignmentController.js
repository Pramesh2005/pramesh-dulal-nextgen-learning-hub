const Assignment = require("../models/Assignment");

// Create a new assignment
const createAssignment = async (req, res) => {
  try {
    const { subjectId, title, description, deadline } = req.body;

    if (!subjectId || !title || !deadline) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const assignment = await Assignment.create({
      subject: subjectId,
      title,
      description,
      deadline,
      providedBy: req.user.name, // teacher name
      createdBy: req.user._id
    });

    res.json({ success: true, assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get assignments for students (only open assignments)
const getStudentAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ isOpen: true })
      .populate("subject", "name")
      .sort({ deadline: 1 });

    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get assignments created by the logged-in teacher
const getTeacherAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ createdBy: req.user._id })
      .populate("subject", "name")
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete assignment (only creator or admin can delete)
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ msg: "Assignment not found" });

    // Make sure createdBy exists
    if (!assignment.createdBy && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized to delete this assignment" });
    }

    // Convert ObjectIds to string safely
    const creatorId = assignment.createdBy ? assignment.createdBy.toString() : null;
    const userId = req.user._id.toString();

    // Only creator or admin can delete
    if (req.user.role !== "admin" && creatorId !== userId) {
      return res.status(403).json({ msg: "Not authorized to delete this assignment" });
    }

    // Use deleteOne instead of remove for safety
    await Assignment.deleteOne({ _id: assignment._id });

    res.json({ success: true, msg: "Assignment deleted" });
  } catch (err) {
    console.error("Delete Assignment Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


module.exports = {
  createAssignment,
  getStudentAssignments,
  getTeacherAssignments,
  deleteAssignment
};
