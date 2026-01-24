import { useEffect, useState } from "react";
import axios from "axios";
import PdfViewer from "../components/PdfViewer/PdfViewer";

export default function ViewSubmissions() {
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ subjectId: "", assignmentId: "" });
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const token = localStorage.getItem("token");

  // Load subjects
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/subjects/all")
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error("Subjects load error:", err));
  }, []);

  // Load assignments
  useEffect(() => {
    if (!filters.subjectId) {
      setAssignments([]);
      setFilters((prev) => ({ ...prev, assignmentId: "" }));
      return;
    }

    axios
      .get("http://localhost:5000/api/assignments/teacher", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const filtered = res.data.filter(
          (a) => a.subject?._id === filters.subjectId || a.subject === filters.subjectId
        );
        setAssignments(filtered);
        setFilters((prev) => ({ ...prev, assignmentId: "" }));
      })
      .catch((err) => console.error("Assignments load error:", err));
  }, [filters.subjectId, token]);

  // Load submissions
  useEffect(() => {
    if (!filters.assignmentId) {
      setStudents([]);
      return;
    }

    axios
      .get("http://localhost:5000/api/submissions/teacher", {
        headers: { Authorization: `Bearer ${token}` },
        params: { assignmentId: filters.assignmentId },
      })
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Submissions load error:", err));
  }, [filters.assignmentId, token]);

  const getStatusText = (s) => (s.submission ? s.submission.status : s.status);
  const getStatusColor = (s) =>
    s.submission?.status === "COMPLETED"
      ? "bg-green-600"
      : s.status === "PENDING"
      ? "bg-yellow-500"
      : "bg-red-600";

  // Correct PDF URL handler
  const handleViewPdf = (fileUrl) => {
    if (!fileUrl) return;

    const fullUrl =
      fileUrl.startsWith("http")
        ? fileUrl
        : `http://localhost:5000/${fileUrl.replace(/^\/?/, "")}`;

    console.log("Opening PDF URL:", fullUrl); // Debug
    setPdfUrl(fullUrl);
    setShowPdf(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📑 Assignment Submissions (Teacher)
      </h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          className="border px-4 py-3 rounded w-1/2"
          value={filters.subjectId}
          onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          className="border px-4 py-3 rounded w-1/2"
          value={filters.assignmentId}
          onChange={(e) => setFilters({ ...filters, assignmentId: e.target.value })}
          disabled={!assignments.length}
        >
          <option value="">Select Assignment</option>
          {assignments.map((a) => (
            <option key={a._id} value={a._id}>
              {a.title}
            </option>
          ))}
        </select>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Student Name</th>
              <th>Status</th>
              <th>Submitted At</th>
              <th>Submission Document</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No data available
                </td>
              </tr>
            )}
            {students.map((s) => (
              <tr key={s._id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">👨‍🎓 {s.name}</td>
                <td>
                  <span
                    className={`px-3 py-1 text-white rounded text-sm ${getStatusColor(
                      s
                    )}`}
                  >
                    {getStatusText(s)}
                  </span>
                </td>
                <td>
                  {s.submission?.submittedAt
                    ? new Date(s.submission.submittedAt).toLocaleString()
                    : "—"}
                </td>
                <td>
                  {s.submission?.fileUrl ? (
                    <button
                      onClick={() => handleViewPdf(s.submission.fileUrl)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View PDF
                    </button>
                  ) : (
                    <span className="text-gray-400 italic">No submission</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PDF Viewer */}
      {showPdf && <PdfViewer url={pdfUrl} onClose={() => setShowPdf(false)} />}
    </div>
  );
}
