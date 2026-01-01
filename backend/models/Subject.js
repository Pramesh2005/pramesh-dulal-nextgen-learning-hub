const mongoose = require('mongoose');
const mcqSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number, // index of correct option
  explanation: String
});



const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pdfs: [{
    title: String,
    fileUrl: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now },
    mcqs:[mcqSchema]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);