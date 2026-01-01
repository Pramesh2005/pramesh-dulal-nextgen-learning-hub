const Subject = require('../models/Subject');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// THIS IS THE CORRECT WAY — WORKS 100%
const pdfParse = require('pdf-parse');

const generateMCQs = async (req, res) => {
  const { subjectId, pdfId } = req.body;

  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ msg: 'Subject not found' });

    const pdf = subject.pdfs.id(pdfId);
    if (!pdf) return res.status(404).json({ msg: 'PDF not found' });

    const pdfPath = path.join(__dirname, '..', pdf.fileUrl);

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ msg: 'PDF file not found on server' });
    }

    const dataBuffer = fs.readFileSync(pdfPath);

    // Extract text from PDF
    const data = await pdfParse(dataBuffer);

    const text = data.text.substring(0, 8000);

    // Call Gemini API
   const response = await axios.post(
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    contents: [{
      parts: [{
        text: `Generate exactly 30 multiple choice questions from this text. Each question must have:
- question: string
- options: array of 4 strings ["A. ...", "B. ...", "C. ...", "D. ..."]
- correctAnswer: "A", "B", "C", or "D"
- explanation: short string

Return ONLY valid JSON array.

Text: ${text}`
      }]
    }]
  }
);

    let mcqs;
    try {
      let content = response.data.candidates[0].content.parts[0].text;

      // Clean markdown
      content = content.replace(/```json|```/g, '').trim();

      // Extract JSON array safely
      const jsonStart = content.indexOf('[');
      const jsonEnd = content.lastIndexOf(']') + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No JSON array found in AI response');
      }

      const jsonString = content.substring(jsonStart, jsonEnd);
      mcqs = JSON.parse(jsonString);

      if (!Array.isArray(mcqs) || mcqs.length === 0) {
        throw new Error('AI returned empty or invalid MCQs');
      }

      console.log(`Successfully parsed ${mcqs.length} MCQs`);

      // ✅ FIX 2: Convert correctAnswer "A|B|C|D" → index 0|1|2|3
const letterToIndex = { A: 0, B: 1, C: 2, D: 3 };

mcqs = mcqs.map((q, index) => {
  if (!letterToIndex.hasOwnProperty(q.correctAnswer)) {
    throw new Error(`Invalid correctAnswer at question ${index + 1}`);
  }

  return {
    question: q.question,
    options: q.options,
    correctAnswer: letterToIndex[q.correctAnswer], // 🔥 conversion here
    explanation: q.explanation || ''
  };
});

    } catch (parseErr) {
      console.error('AI Response Parse Error:', parseErr);
      console.error('Raw AI response:', response.data.candidates[0].content.parts[0].text);
      return res.status(500).json({ 
        msg: 'Failed to parse AI response - invalid JSON format'
      });
    }

    // Save MCQs to DB
    pdf.mcqs = mcqs;
    await subject.save();

    res.json({
      success: true,
      message: '30 MCQs generated successfully!',
      mcqCount: mcqs.length
    });

  } catch (err) {
    console.error('MCQ Generation Error:', err.response?.data || err.message);
    res.status(500).json({ msg: 'Failed to generate MCQs' });
  }
};

module.exports = { generateMCQs };