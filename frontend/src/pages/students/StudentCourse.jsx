import { useEffect, useState } from "react";
import axios from "axios";
import PdfViewer from "../../components/PdfViewer/PdfViewer"; 

function StudentDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/subjects/all");
        setSubjects(res.data);
      } catch (err) {
        alert("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };
    loadSubjects();
  }, []);

  // Handler to view PDF in-page
  const handleViewPdf = (url) => {
    setPdfUrl(`http://localhost:5000${url}`); // prepend backend URL
    setShowPdf(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Course List</h1>

      {loading ? (
        <p className="text-center">Loading subjects...</p>
      ) : subjects.length === 0 ? (
        <p className="text-center text-gray-500">No subjects available</p>
      ) : (
        subjects.map((subject) => (
          <div key={subject._id} className="border p-4 rounded mb-4 shadow-sm">
            <h3 className="font-bold text-green-600">{subject.name}</h3>
            <p>{subject.description || "No description"}</p>
            <ul className="mt-2">
              {subject.pdfs.length === 0 ? (
                <li className="text-gray-500">No PDFs available</li>
              ) : (
                subject.pdfs.map((pdf) => (
                  <li key={pdf._id} className="flex justify-between items-center mt-1">
                    <span>{pdf.title}</span>
                    <button
                      onClick={() => handleViewPdf(pdf.fileUrl)}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      View
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        ))
      )}

      {/* PDF Viewer Modal */}
      {showPdf && <PdfViewer url={pdfUrl} onClose={() => setShowPdf(false)} />}
    </div>
  );
}

export default StudentDashboard;
