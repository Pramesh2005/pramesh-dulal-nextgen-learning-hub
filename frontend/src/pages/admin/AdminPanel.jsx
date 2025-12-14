import axios from "axios";
import { useEffect, useState } from "react";
import NoticeBoard from "../../components/NoticeBoard";
import NoticeManager from "../../components/NoticeManager";
import Sidebar from "../../components/Sidebar";
export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:5000/api/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.log("Fetch error:", err));
  };

  const approve = (id) => {
    axios
      .put(
        `http://localhost:5000/api/users/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(fetchUsers);
  };

  const reject = (id) => {
    axios
      .put(
        `http://localhost:5000/api/users/reject/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(fetchUsers)
      .catch((err) => console.log("Reject failed:", err));
  };

  return (
    <div className="flex">
<Sidebar/>
   
    <div className="flex-1 p-6 md:p-12 bg-gray-50 min-h-screen">
      
      <h1 className="text-center text-3xl md:text-4xl font-bold text-black-900 mb-6">
        Admin Panel - User Management
      </h1>

      {/* Refresh Button */}
      <button
        onClick={fetchUsers}
        className="mb-6 bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-lg shadow-md"
      >
        Refresh List
      </button>

      {/* Table Wrapper */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <table className="w-full text-sm text-center border-collapse">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>

                <td
                  className={`p-3 font-bold
                    ${
                      u.status === "active"
                        ? "text-green-600"
                        : u.status === "blocked"
                        ? "text-red-600"
                        : "text-orange-500"
                    }
                `}
                >
                  {u.status.toUpperCase()}
                </td>

                <td className="p-3">
                  {u.status === "pending" && (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => approve(u._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded shadow"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => reject(u._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <NoticeManager />
      <NoticeBoard />
    </div>
     </div>
  );
}
