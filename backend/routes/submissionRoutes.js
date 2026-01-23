const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const uploadAssignment = require("../middleware/assignmentUpload");

const { submitAssignment } = require("../controllers/studentSubmissionController");
const { getSubmissions } = require("../controllers/submissionViewController");

// Student submit
router.post(
  "/student",
  protect,
  uploadAssignment.single("file"),
  submitAssignment
);

// Teacher/Admin view
router.get("/", protect, getSubmissions);

module.exports = router;
