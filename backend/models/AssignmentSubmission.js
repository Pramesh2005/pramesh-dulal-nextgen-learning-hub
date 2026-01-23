const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true
  },

  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  studentName: {
    type: String,
    required: true
  },

  fileUrl: {
    type: String,
    required: true
  },

  submittedAt: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    enum: ["COMPLETED", "MISSED"],
    default: "COMPLETED"
  }
});

module.exports = mongoose.model("AssignmentSubmission", assignmentSubmissionSchema);
