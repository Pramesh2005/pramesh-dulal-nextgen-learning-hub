const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionIndex: Number,
  selectedOption: Number,
  correctOption: Number,
  correct: Boolean
});

const examSubmissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  pdfTitle: String,
  startTime: Date,
  endTime: Date,
  score: Number,
  totalQuestions: Number,
  answers: [answerSchema],
  submitted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ExamSubmission', examSubmissionSchema);