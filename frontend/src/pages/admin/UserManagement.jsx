import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  // Use useCallback to avoid useEffect warning
  const fetchUsers = useCallback(() => {
    axios
      .get("http://localhost:5000/api/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.log("Fetch error:", err));
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const approve = (id) => {
    axios
      .put(`http://localhost:5000/api/users/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(fetchUsers);
  };

  const reject = (id) => {
    axios
      .put(`http://localhost:5000/api/users/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(fetchUsers);
  };

  const blockUser = (id) => {
    axios
      .put(`http://localhost:5000/api/users/block/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(fetchUsers);
  };

  const unblockUser = (id) => {
    axios
      .put(`http://localhost:5000/api/users/unblock/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(fetchUsers);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          User Management
        </h2>

        {/* Refresh Button */}
        <div className="mb-4 text-center">
          <button
            onClick={fetchUsers}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
          >
            Refresh List
          </button>
        </div>

        {/* Table */}
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
                    className={`p-3 font-bold ${
                      u.status === "active"
                        ? "text-green-600"
                        : u.status === "blocked"
                        ? "text-red-600"
                        : "text-orange-500"
                    }`}
                  >
                    {u.status.toUpperCase()}
                  </td>

                  <td className="p-3 flex justify-center gap-2">
                    {/* Pending → Approve / Reject */}
                    {u.status === "pending" && (
                      <>
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
                      </>
                    )}

                    {/* Active → Block */}
                    {u.status === "active" && (
                      <button
                        onClick={() => blockUser(u._id)}
                        className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded shadow"
                      >
                        Block
                      </button>
                    )}

                    {/* Blocked → Unblock */}
                    {u.status === "blocked" && (
                      <button
                        onClick={() => unblockUser(u._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow"
                      >
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
