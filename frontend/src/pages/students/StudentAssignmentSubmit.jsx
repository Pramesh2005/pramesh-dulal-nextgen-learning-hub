import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function StudentAssignmentSubmit() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/assignments/student",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        const found = res.data.find(a => a._id === id);

        if (!found) {
          alert("Assignment not found");
          return;
        }

        setAssignment(found);
      } catch (err) {
        console.error(err);
        alert("Failed to load assignment");
      }
    };

    loadAssignment();
  }, [id]);

  const submit = async () => {
    if (!file) return alert("Select a file");
    if (new Date() > new Date(assignment.deadline)) {
      return alert("Deadline has passed. Cannot submit.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignmentId", id);

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/submissions/student",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Assignment submitted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (!assignment) return <p>Loading assignment...</p>;

  const isDeadlinePassed = new Date() > new Date(assignment.deadline);

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">{assignment.title}</h2>
      <p className="mb-4">{assignment.description}</p>
      <p className="mb-4 text-sm text-gray-600">
        Deadline: {new Date(assignment.deadline).toLocaleString()}
      </p>

      {isDeadlinePassed ? (
        <p className="text-red-600 font-semibold">Deadline has passed. Cannot submit.</p>
      ) : (
        <>
          <input type="file" onChange={e => setFile(e.target.files[0])} />
          <button
            onClick={submit}
            disabled={loading}
            className="ml-2 bg-green-600 text-white px-4 py-1 rounded"
          >
            {loading ? "Submitting..." : "Submit Assignment"}
          </button>
        </>
      )}
    </div>
  );
}
