import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PdfViewer from "../../components/PdfViewer/PdfViewer"; // Ensure this path is correct

export default function StudentAssignmentSubmit() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const loadAssignmentAndSubmission = async () => {
      try {
        // Load assignment
        const res = await axios.get("http://localhost:5000/api/assignments/student", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const found = res.data.find((a) => a._id === id);
        if (!found) {
          setMessage("Assignment not found.");
          return;
        }
        setAssignment(found);

        // Load previous submission
        const subRes = await axios.get(
          `http://localhost:5000/api/submissions/student/${id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        setSubmission(subRes.data); // null if no submission
      } catch (err) {
        console.error("Error loading assignment or submission:", err);
        setMessage("Failed to load assignment or submission.");
      }
    };

    loadAssignmentAndSubmission();
  }, [id]);

  const submit = async () => {
    if (!file) return setMessage("⚠️ Please select a file first!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignmentId", id);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/submissions/student",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSubmission(res.data.submission);
      setMessage("✅ Assignment submitted successfully!");
      setFile(null);
    } catch (err) {
      console.error("Submission error:", err);
      setMessage(err.response?.data?.msg || "❌ Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!submission) return;
    if (!window.confirm("Are you sure you want to delete your submission?")) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/submissions/student/${submission._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setSubmission(null);
      setMessage("🗑️ Submission deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      setMessage(err.response?.data?.msg || "❌ Failed to delete submission");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPdf = (url) => {
    setPdfUrl(`http://localhost:5000${url}`);
    setShowPdf(true);
  };

  if (!assignment)
    return <p className="text-center mt-10 text-gray-500">Loading assignment...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 mb-20 md:mb-32 lg:mb-40 p-8 bg-white rounded-3xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-indigo-700 mb-4">{assignment.title}</h2>
      <p className="text-gray-700 mb-4">{assignment.description}</p>
      <p className="text-sm text-gray-500 mb-6">
        Deadline: <span className="font-semibold">{new Date(assignment.deadline).toLocaleString()}</span>
      </p>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg font-medium ${
            message.includes("success") || message.includes("🗑️")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {submission ? (
        <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200 shadow-md">
          <h3 className="font-semibold text-indigo-700 mb-4 text-lg">Your Submission</h3>

          {submission.fileUrl ? (
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-gray-800">
                {submission.fileUrl.split("/").pop()}
              </span>
              <button
                onClick={() => handleViewPdf(submission.fileUrl)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View PDF
              </button>
            </div>
          ) : (
            <p className="text-gray-500 mb-4">No file uploaded</p>
          )}

          <p className="mb-1">Status: <span className="font-semibold">{submission.status || "Submitted"}</span></p>
          <p className="mb-4">Submitted On: {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : "N/A"}</p>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="mt-2 w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
          >
            {loading ? "Deleting..." : "Delete Submission"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col space-y-4 mt-4">
          <label className="flex flex-col border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition duration-300">
            <span className="text-gray-500 text-center">
              {file ? file.name : "Drag & drop a file here or click to select"}
            </span>
            <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          </label>

          <button
            onClick={submit}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Assignment"}
          </button>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {showPdf && (
        <PdfViewer
          url={pdfUrl}
          onClose={() => setShowPdf(false)}
        />
      )}
    </div>
  );
}
