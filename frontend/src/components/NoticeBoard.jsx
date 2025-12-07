import { useEffect, useState } from "react";
import axios from "axios";

function NoticeBoard() {
  const [notices, setNotices] = useState([]);

  const loadNotices = async () => {
    const res = await axios.get("http://localhost:5000/api/notices/all", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setNotices(res.data);
  };

  useEffect(() => {
    loadNotices();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4 text-center"> Notice Board</h2>

      {notices.length === 0 ? (
        <p>No active notices</p>
      ) : (
        notices.map((n) => (
          <div key={n._id} className="border p-3 rounded mb-2">
            <h3 className="font-bold text-green-600">{n.title}</h3>
            <p>{n.description}</p>

            <div className="text-sm text-gray-600 mt-1">
              <div className="flex gap-20 mt-1">
                <span>Created: {new Date(n.createdAt).toLocaleString()}</span>
                <span>Ends: {new Date(n.endDate).toLocaleString()}</span>
              </div>

              <div className="font-semibold">
                By: {n.postedBy?.name} ({n.postedBy?.role})
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default NoticeBoard;
