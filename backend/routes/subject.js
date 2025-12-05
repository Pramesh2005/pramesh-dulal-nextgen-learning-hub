const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { createSubject, getSubjects,updateSubject,deleteSubject, uploadPdf } = require('../controllers/subjectController');
const multer = require("multer");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save PDFs
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/create', protect, admin, createSubject);
router.get('/all', getSubjects);
router.put('/:id', protect, admin, updateSubject);
router.delete('/:id', protect, admin, deleteSubject); 

// Teacher route: upload PDF
router.post("/upload-pdf", protect, upload.single("file"), uploadPdf);
module.exports = router;
