import { useEffect, useState } from "react";
import axios from "axios";
import PdfViewer from "../../components/PdfViewer/PdfViewer";

function TeacherDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
const [generating, setGenerating] = useState(false);
const [confirmGenerate, setConfirmGenerate] = useState(null); 
const [selectedMCQs, setSelectedMCQs] = useState(null);
  const loadSubjects = async () => {
    const res = await axios.get("http://localhost:5000/api/subjects/all");
    setSubjects(res.data);
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleUpload = async () => {
    if (!file || !title || !selectedSubjectId) return alert("All fields required");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("subjectId", selectedSubjectId);

    try {
      await axios.post("http://localhost:5000/api/subjects/upload-pdf", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "multipart/form-data" },
      });
      alert("PDF uploaded!");
      setFile(null);
      setTitle("");
      setSelectedSubjectId("");
      loadSubjects();
    } catch (err) {
      alert(err.response?.data?.msg || "Upload failed");
    }
  };


const handleConfirmGenerate = async () => {
  const { subjectId, pdfId } = confirmGenerate;

  setGenerating(true);

  try {
    const res = await axios.post(
      'http://localhost:5000/api/mcq/generate',
      { subjectId, pdfId },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }
    );

    if (res.data.success) {
      alert(`Success! ${res.data.mcqCount} MCQs generated`);
      // Force refresh the subjects list
      await loadSubjects();
      // Force React to re-render with new data
      setSubjects(prev => [...prev]);
    }
  } catch (err) {
    alert(err.response?.data?.msg || 'Failed to generate MCQs');
  } finally {
    setGenerating(false);
    setConfirmGenerate(null);
  }
};
  
  const handleViewPdf = (url) => {
    setPdfUrl(`http://localhost:5000${url}`);
    setShowPdf(true);
  };

  const handleDeletePdf = async (subjectId, pdfId) => {
  if (!window.confirm("Are you sure you want to delete this PDF?")) return;

  try {
    await axios.delete(
      `http://localhost:5000/api/subjects/${subjectId}/pdf/${pdfId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    alert("PDF deleted successfully");
    loadSubjects(); // refresh UI
  } catch (err) {
    alert(err.response?.data?.msg || "Delete failed");
  }
};


  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Teacher Dashboard</h1>

      {/* Upload PDF */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-md mb-8">
        <h2 className="font-semibold mb-4">Upload PDF</h2>

        <select
          className="border px-4 py-2 rounded mb-2 w-full"
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="PDF Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-4 py-2 rounded mb-2 w-full"
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2"
        />

        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Upload
        </button>
      </div>

      {/* Subject PDFs */}
<div>
  <h2 className="text-2xl font-bold mb-8 text-gray-800">My Subjects & PDFs</h2>
  {subjects.length === 0 ? (
    <p className="text-center text-gray-500">No subjects yet. Ask admin to create one!</p>
  ) : (
    subjects.map((subject) => (
      <div key={subject._id} className="mb-10">
        <h3 className="text-2xl font-bold text-indigo-600 mb-6">{subject.name}</h3>
        {subject.pdfs.length === 0 ? (
          <p className="text-gray-500 italic">No PDFs uploaded yet</p>
        ) : (
          <div className="space-y-4">
            {subject.pdfs.map((pdf) => (
              <div key={pdf._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                <div className="mb-4 sm:mb-0">
                  <span className="text-xl font-semibold text-gray-800">{pdf.title}</span>
                  {pdf.mcqs && pdf.mcqs.length > 0 && (
                    <span className="ml-4 text-green-600 font-medium">
                      ✓ {pdf.mcqs.length} MCQs generated
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleViewPdf(pdf.fileUrl)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    View PDF
                  </button>
                  <button
    onClick={() => handleDeletePdf(subject._id, pdf._id)}
    className="px-6 py-3 bg-red-600 text-white rounded-lg"
  >
    Delete PDF
  </button>
                 {!pdf.mcqs || pdf.mcqs.length === 0 ? (
  <button
    onClick={() => setConfirmGenerate({ subjectId: subject._id, pdfId: pdf._id })}
    disabled={generating}
    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
  >
    {generating ? 'Generating...' : 'Generate 30 AI MCQs'}
  </button>
) : (
  <div className="flex gap-3 items-center">
    <span className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium">
      ✓ {pdf.mcqs.length} MCQs Ready
    </span>
    <button
      onClick={() => setSelectedMCQs(pdf.mcqs)}
      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
    >
      View Questions
    </button>
  </div>
)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ))
  )}
</div>

      {showPdf && <PdfViewer url={pdfUrl} onClose={() => setShowPdf(false)} />}
    {/* Confirmation Modal */}
{confirmGenerate && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
      <h3 className="text-2xl font-bold mb-4">Generate MCQs?</h3>
      <p className="text-gray-700 mb-8">
        Generate 30 AI-powered MCQs for this PDF?
      </p>
      <div className="flex gap-4">
        <button
          onClick={handleConfirmGenerate}
          className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700"
        >
          Yes, Generate
        </button>
        <button
          onClick={() => setConfirmGenerate(null)}
          className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-bold hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
{/* View Generated MCQs Modal */}
{selectedMCQs && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl p-10 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-bold text-indigo-700">
          {selectedMCQs.length} Generated MCQs
        </h3>
        <button
          onClick={() => setSelectedMCQs(null)}
          className="text-4xl text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <ol className="space-y-8">
        {selectedMCQs.map((q, i) => (
          <li key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
            <p className="text-xl font-bold text-gray-800 mb-6">
              {i + 1}. {q.question}
            </p>
            <ul className="space-y-3 mb-6 ml-6">
              {q.options.map((opt, j) => (
                <li
                  key={j}
                  className={`text-lg ${
                    j === q.correctAnswer
                      ? "text-green-600 font-bold"
                      : "text-gray-700"
                  }`}
                >
                  {opt}
                </li>
              ))}
            </ul>
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="font-medium text-green-800">
                Correct Answer: {q.options[q.correctAnswer]}
              </p>
              {q.explanation && (
                <p className="text-green-700 mt-2">
                  <span className="font-medium">Explanation:</span> {q.explanation}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  </div>
)}
    </div>
  );
  
}

export default TeacherDashboard;
