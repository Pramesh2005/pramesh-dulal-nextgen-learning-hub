import { useEffect, useState } from "react";
import axios from "axios";

function AdminUploads() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUploads = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/subjects/uploads/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
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
      <h1 className="text-3xl font-bold text-center mb-8"> Teachers Uploads Records</h1>
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
                </tr>
              </thead>
              <tbody>
                {subject.pdfs.map((pdf) => (
                  <tr key={pdf._id}>
                    <td className="border px-2 py-1">{pdf.title}</td>
                    <td className="border px-2 py-1">{pdf.uploadedBy?.name || "Unknown"}</td>
                    <td className="border px-2 py-1">{new Date(pdf.uploadedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminUploads;
