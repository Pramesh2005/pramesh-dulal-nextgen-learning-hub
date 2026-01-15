const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { createSubject, getSubjects,updateSubject,deleteSubject, uploadPdf,deletePdf } = require('../controllers/subjectController');
const multer = require("multer");
const Subject = require('../models/Subject'); 

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
router.delete(
  "/:subjectId/pdf/:pdfId",
  protect,
  deletePdf
);

// Admin: View all uploads
router.get('/uploads/all', protect, admin, async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('createdBy', 'name')
      .populate('pdfs.uploadedBy', 'name')// teacher who uploaded
    .sort({ 'pdfs.uploadedAt': -1 });
      res.json(subjects);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


module.exports = router;
