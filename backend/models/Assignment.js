const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: String,

  providedBy: String, // Teacher name

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  deadline: {
    type: Date,
    required: true
  },

  isOpen: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Assignment", assignmentSchema);
