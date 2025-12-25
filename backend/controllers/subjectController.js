const Subject = require('../models/Subject');

// ADMIN: Create Subject
const createSubject = async (req, res) => {
  const { name, description } = req.body;
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

  try {
    const subject = new Subject({ name, description, createdBy: req.user.id });
    await subject.save();
    res.json({ success: true, subject });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET ALL SUBJECTS (Everyone)
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate('createdBy', 'name').populate('pdfs.uploadedBy', 'name');
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// UPDATE
const updateSubject = async (req, res) => {
  const { name, description } = req.body;
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ msg: 'Subject not found' });

    subject.name = name || subject.name;
    subject.description = description || subject.description;
    await subject.save();

    res.json({ success: true, subject });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// DELETE SUBJECT
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ msg: 'Subject not found' });

    // Use deleteOne instead of remove
    await Subject.deleteOne({ _id: req.params.id });

    res.json({ success: true, msg: 'Subject deleted' });
  } catch (err) {
    console.error(err); // Show the full error in console
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// TEACHER: Upload PDF to Subject
const uploadPdf = async (req, res) => {
  const { subjectId, title } = req.body;

  if (!req.file) return res.status(400).json({ msg: "File is required" });
  if (!subjectId || !title) return res.status(400).json({ msg: "Subject ID and title are required" });

  if (req.user.role !== "teacher") return res.status(403).json({ msg: "Only teachers can upload" });

  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ msg: "Subject not found" });

    subject.pdfs.push({
      title,
      fileUrl: `/uploads/${req.file.filename}`, // file path
      uploadedBy: req.user.id
    });

    await subject.save();

// get last inserted pdf (the one just uploaded)
const savedPdf = subject.pdfs[subject.pdfs.length - 1];

res.json({
  success: true,
  message: "PDF uploaded successfully",
  pdf: {
    _id: savedPdf._id,
    title: savedPdf.title,
    fileUrl: savedPdf.fileUrl
  }
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


module.exports = { createSubject, getSubjects, updateSubject, deleteSubject, uploadPdf };