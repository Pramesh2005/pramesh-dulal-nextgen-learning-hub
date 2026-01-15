import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
function CreateSubject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const formRef = useRef(null);

  const loadSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/subjects/all");
      setSubjects(res.data);
    } catch {
      alert("❌ Failed to load subject list");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleCreateSubject = async () => {
    if (!name.trim()) return alert("Subject name is required!");
    try {
      setLoading(true);

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/subjects/${editingId}`,
          { name, description },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        alert("✅ Subject updated!");
        setEditingId(null);
      } else {
        await axios.post(
          "http://localhost:5000/api/subjects/create",
          { name, description },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        alert("✅ Subject created!");
      }

      setName("");
      setDescription("");
      await loadSubjects();
    } catch (error) {
      alert(error.response?.data?.msg || "❌ Failed to save subject");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubject = (subject) => {
    setName(subject.name);
    setDescription(subject.description || "");
    setEditingId(subject._id);

    //Scroll form into view smoothly
      if (formRef.current) {
    formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/subjects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("✅ Subject deleted!");
      await loadSubjects();
    } catch (err) {
      alert(err.response?.data?.msg || "❌ Failed to delete subject");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* HEADER */}
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-12">
        Subject Management
      </h1>

      {/* CREATE / EDIT CARD */}
      <div
      ref={formRef}
      className="bg-gray-50 rounded-3xl shadow-2xl p-10 max-w-2xl mx-auto border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          {editingId ? "Edit Subject" : "Create New Subject"}
        </h2>

        <div className="flex flex-col gap-4">
          <input
            placeholder="📘 Subject Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
          />
          <input
            placeholder="📝 Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
          />

          <div className="flex justify-center mt-6">
            <button
              onClick={handleCreateSubject}
              disabled={loading}
              className={`px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 transform hover:scale-105"
              }`}
            >
              {loading ? "Saving..." : editingId ? "Update Subject" : "Create Subject"}
            </button>
          </div>
        </div>
      </div>

      {/* SUBJECT LIST */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-gray-700 mb-8 text-center">
          Created Subjects
        </h2>

        {loadingList ? (
          <p className="text-gray-500 text-center">Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <p className="text-gray-500 text-center">No subjects created yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject) => (
              <div
                key={subject._id}
                className="bg-white shadow-lg hover:shadow-2xl transition rounded-2xl p-6 border border-gray-200"
              >
                <h3 className="text-xl font-bold text-green-600">{subject.name}</h3>
                <p className="mt-2 text-gray-600">{subject.description || "No description provided."}</p>
                <p className="text-xs text-gray-400 mt-3">
                  Created on {new Date(subject.createdAt).toLocaleDateString()}
                </p>

                <div className="mt-5 flex justify-between">
                  <button
                    onClick={() => handleEditSubject(subject)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 shadow-sm text-sm font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(subject._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-sm text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateSubject;
