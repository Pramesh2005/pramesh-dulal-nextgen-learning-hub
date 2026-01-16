import { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherAssignmentsPanel() {
  // Form state
  const [subjects, setSubjects] = useState([]);
  const [data, setData] = useState({
    subjectId: "",
    title: "",
    description: "",
    deadline: ""
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Teacher assignments state
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Load subjects for dropdown
  useEffect(() => {
    axios.get("http://localhost:5000/api/subjects/all")
      .then(res => setSubjects(res.data))
      .catch(err => console.error(err));
  }, []);

  // Load teacher assignments
  const loadAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assignments/teacher", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load assignments");
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  // Submit new assignment
  const submit = async () => {
    if (!data.subjectId || !data.title || !data.deadline) {
      return alert("Please fill all required fields!");
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/assignments/create",
        data,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setSuccessMsg("✅ Assignment added successfully!");
      setData({ subjectId: "", title: "", description: "", deadline: "" });

      // Refresh list
      loadAssignments();

      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to add assignment");
    } finally {
      setLoading(false);
    }
  };

  // Delete assignment
  const deleteAssignment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/assignments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("Assignment deleted successfully!");
      setAssignments(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Delete failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-5xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">Assignments</h2>

      {/* Add Assignment Form */}
      <div className="mb-8 border p-6 rounded-xl bg-gray-50">
        <h3 className="text-xl font-semibold mb-4">Create New Assignment</h3>

        {successMsg && (
          <div className="mb-4 text-green-700 font-semibold">{successMsg}</div>
        )}

        <select
          className="border p-2 w-full mb-3"
          value={data.subjectId}
          onChange={e => setData({ ...data, subjectId: e.target.value })}
        >
          <option value="">Select Subject</option>
          {subjects.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        <input
          placeholder="Title"
          value={data.title}
          className="border p-2 w-full mb-3"
          onChange={e => setData({ ...data, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          value={data.description}
          className="border p-2 w-full mb-3"
          onChange={e => setData({ ...data, description: e.target.value })}
        />

        <input
          type="datetime-local"
          value={data.deadline}
          className="border p-2 w-full mb-4"
          onChange={e => setData({ ...data, deadline: e.target.value })}
        />

        <button
          onClick={submit}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish Assignment"}
        </button>
      </div>

      {/* Teacher Assignments List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">My Created Assignments</h3>
        {assignments.length === 0 ? (
          <p className="text-gray-500">No assignments created yet.</p>
        ) : (
          assignments.map(a => (
            <div key={a._id} className="border p-4 rounded mb-4 bg-indigo-50 flex justify-between items-start">
              <div>
                <h4 className="font-bold text-indigo-700">{a.title}</h4>
                <p>{a.description}</p>
                <div className="text-sm text-gray-600 mt-2">
                  <p>📘 Subject: {a.subject.name}</p>
                  <p>⏰ Deadline: {new Date(a.deadline).toLocaleString()}</p>
                  <p>Created At: {new Date(a.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={() => setSelectedAssignment(a)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View
                </button>

                <button
                  onClick={() => deleteAssignment(a._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for viewing assignment */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-indigo-700">{selectedAssignment.title}</h3>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <p className="mb-4">{selectedAssignment.description}</p>
            <div className="text-sm text-gray-600">
              <p>📘 Subject: {selectedAssignment.subject.name}</p>
              <p>👨‍🏫 Provided By: {selectedAssignment.providedBy}</p>
              <p>⏰ Deadline: {new Date(selectedAssignment.deadline).toLocaleString()}</p>
              <p>Created At: {new Date(selectedAssignment.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
