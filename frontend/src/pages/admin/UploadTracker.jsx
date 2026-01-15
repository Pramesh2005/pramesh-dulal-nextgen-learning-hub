import { useEffect, useState } from "react";
import axios from "axios";
import PdfViewer from "../../components/PdfViewer/PdfViewer";

function AdminUploads() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleViewPdf = (fileUrl) => {
  setPdfUrl(`http://localhost:5000${fileUrl}`);
  setShowPdf(true);
};

const [showPdf, setShowPdf] = useState(false);
const [pdfUrl, setPdfUrl] = useState("");

  const handleDeletePdf = async (subjectId, pdfId) => {
    if (!window.confirm("Are you sure you want to delete this PDF?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/subjects/${subjectId}/pdf/${pdfId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("PDF deleted successfully");

      // Refresh UI
      setSubjects((prev) =>
        prev.map((subj) =>
          subj._id === subjectId
            ? { ...subj, pdfs: subj.pdfs.filter((p) => p._id !== pdfId) }
            : subj
        )
      );
    } catch (err) {
      alert(err.response?.data?.msg || "Delete failed");
    }
  };

  useEffect(() => {
    const loadUploads = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/subjects/uploads/all",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSubjects(res.data);
      } catch (err) {
        alert("Failed to load uploads");
      } finally {
        setLoading(false);
      }
    };
    loadUploads();
  }, []);

  if (loading) return <p className="text-center">Loading uploads...</p>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        {" "}
        Teachers Uploads Records
      </h1>
      {subjects.map((subject) => (
        <div key={subject._id} className="border p-4 rounded mb-4 shadow-sm">
          <h3 className="font-bold text-green-600">{subject.name}</h3>
          {subject.pdfs.length === 0 ? (
            <p>No PDFs uploaded yet</p>
          ) : (
            <table className="w-full table-auto mt-2 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">Title</th>
                  <th className="border px-2 py-1">Teacher</th>
                  <th className="border px-2 py-1">Uploaded At</th>
                  <th className="border px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subject.pdfs.map((pdf) => (
                  <tr key={pdf._id}>
                    <td className="border px-2 py-1">{pdf.title}</td>
                    <td className="border px-2 py-1">
                      {pdf.uploadedBy?.name || "Unknown"}
                    </td>
                    <td className="border px-2 py-1">
                      {new Date(pdf.uploadedAt).toLocaleString()}
                    </td>
                    <td className="border px-2 py-1 space-x-2">
                      <button
                        onClick={() => handleViewPdf(pdf.fileUrl)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleDeletePdf(subject._id, pdf._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
      {showPdf && (
  <PdfViewer
    url={pdfUrl}
    onClose={() => setShowPdf(false)}
  />
)}

    </div>
  );
}

export default AdminUploads;
