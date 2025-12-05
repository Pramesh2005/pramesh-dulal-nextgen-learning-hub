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

  
  const handleViewPdf = (url) => {
    setPdfUrl(`http://localhost:5000${url}`);
    setShowPdf(true);
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
        <h2 className="text-xl font-semibold mb-4">Subjects</h2>
        {subjects.map((subject) => (
          <div key={subject._id} className="mb-6 bg-white p-4 rounded shadow">
            <h3 className="font-bold text-green-600">{subject.name}</h3>
            {subject.pdfs.map((pdf) => (
              <div key={pdf._id} className="flex justify-between items-center mt-2">
                <span>{pdf.title}</span>
                <button
                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => handleViewPdf(pdf.fileUrl)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {showPdf && <PdfViewer url={pdfUrl} onClose={() => setShowPdf(false)} />}
    </div>
  );
}

export default TeacherDashboard;
