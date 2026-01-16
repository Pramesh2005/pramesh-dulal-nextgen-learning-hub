import { useEffect, useState } from "react";
import axios from "axios";

export default function AssignmentNotice() {
  const [assignments, setAssignments] = useState([]);

  const loadAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assignments/student", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAssignments();

    // refresh every minute to hide expired assignments automatically
    const interval = setInterval(() => loadAssignments(), 60000);
    return () => clearInterval(interval);
  }, []);

  const now = new Date();

  return (
    <div className="bg-white p-6 rounded shadow mt-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">📝 Assignment Notices</h2>

      {assignments.filter(a => new Date(a.deadline) > now).length === 0 ? (
        <p className="text-center text-gray-500">No active assignments</p>
      ) : (
        assignments
          .filter(a => new Date(a.deadline) > now) // only future assignments
          .map(a => (
            <div key={a._id} className="border p-4 rounded mb-3 bg-indigo-50">
              <h3 className="font-bold text-indigo-700">{a.title}</h3>
              <p>{a.description}</p>

              <div className="text-sm text-gray-600 mt-2">
                <p>📘 Subject: {a.subject.name}</p>
                <p>👨‍🏫 By: {a.providedBy}</p>
                <p>⏰ Deadline: {new Date(a.deadline).toLocaleString()}</p>
              </div>

              <div className="mt-2 font-semibold text-green-600">
             Submission Open
              </div>
            </div>
          ))
      )}
    </div>
  );
}
