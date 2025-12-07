import { useEffect, useState } from "react";
import axios from "axios";

function NoticeManager() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  // Load existing notices
  const loadNotices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notices/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(res.data);
    } catch (err) {
      console.error("Load notices error:", err);
      alert("Failed to load notices");
    }
  };

  useEffect(() => {
    loadNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or Update Notice
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Update existing notice
        await axios.put(
          `http://localhost:5000/api/notices/${editingId}`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Notice updated successfully ");
      } else {
        // Create new notice
        await axios.post("http://localhost:5000/api/notices/create", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Notice posted successfully ");
      }

      resetForm();
      await loadNotices();
    } catch (err) {
      console.error("Save notice error:", err);
      alert("Failed to save notice ");
    } finally {
      setLoading(false);
    }
  };

  // Edit: fill form and set editing mode
  const editNotice = (notice) => {
    setEditingId(notice._id);

    // Ensure datetime-local compatible format: yyyy-mm-ddThh:mm
    const formatForInput = (d) => {
      if (!d) return "";
      const dt = new Date(d);
      const pad = (n) => String(n).padStart(2, "0");
      const yyyy = dt.getFullYear();
      const mm = pad(dt.getMonth() + 1);
      const dd = pad(dt.getDate());
      const hh = pad(dt.getHours());
      const min = pad(dt.getMinutes());
      return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    };

    setForm({
      title: notice.title || "",
      description: notice.description || "",
      startDate: formatForInput(notice.startDate),
      endDate: formatForInput(notice.endDate),
    });

    // scroll to form (optional UX)
    const el = document.querySelector("form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Delete Notice
  const deleteNotice = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadNotices();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete notice");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: "", description: "", startDate: "", endDate: "" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Notice Manager</h1>

      {/* Create / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 p-5 rounded-xl shadow mb-8"
      >
        <h2 className="font-semibold mb-3">
          {editingId ? "Edit Notice" : "Post New Notice"}
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Notice Title"
          value={form.title}
          onChange={handleChange}
          className="border w-full px-3 py-2 rounded mb-2"
          required
        />

        <textarea
          name="description"
          placeholder="Notice Description"
          value={form.description}
          onChange={handleChange}
          className="border w-full px-3 py-2 rounded mb-2"
          rows="4"
          required
        />

        <div className="grid grid-cols-2 gap-2 mb-3">
          <input
            type="datetime-local"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="border px-2 py-2 rounded"
            required
          />

          <input
            type="datetime-local"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="border px-2 py-2 rounded"
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Notice"
              : "Post Notice"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-2 rounded bg-gray-400 text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Notice List */}
      <div>
        <h2 className="font-semibold mb-3">Active Notices</h2>

        {notices.length === 0 ? (
          <p className="text-gray-500">No notices posted</p>
        ) : (
          notices.map((n) => (
            <div
              key={n._id}
              className="border p-3 rounded mb-3 flex justify-between items-start"
            >
              <div>
                <h3 className="font-bold">{n.title}</h3>
                <p className="mt-1">{n.description}</p>
                <div className="flex gap-40 text-xs text-gray-600 mt-1">
                  <span>
                    Created: {new Date(n.createdAt).toLocaleString()}
                  </span>


                  <span> Ends: {new Date(n.endDate).toLocaleString()}</span>
                </div>

                {n.updatedAt !== n.createdAt && (
                  <p className="text-xs text-blue-600">
                    Updated: {new Date(n.updatedAt).toLocaleString()}
                  </p>
                )}
                <p className="text-xs font-bold text-gray-600 mt-1">
                  Posted by: {n.postedBy?.name || "Unknown"}
                </p>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={() => editNotice(n)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteNotice(n._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NoticeManager;
