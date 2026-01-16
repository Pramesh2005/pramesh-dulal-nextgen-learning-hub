const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");
const assignmentController = require("../controllers/assignmentController");

// Create new assignment
router.post("/create", protect, assignmentController.createAssignment);

// Get assignments for students
router.get("/student", protect, assignmentController.getStudentAssignments);

// Get assignments created by logged-in teacher
router.get("/teacher", protect, assignmentController.getTeacherAssignments);

// Delete an assignment
router.delete("/:id", protect, assignmentController.deleteAssignment);

module.exports = router;
