import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import NoticeBoard from "../../components/NoticeBoard";
import NoticeManager from "../../components/NoticeManager";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:5000/api/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.log("Users fetch error:", err));
  };

  const fetchCourses = () => {
    axios
      .get("http://localhost:5000/api/subjects/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCourses(res.data))
      .catch((err) => console.log("Courses fetch error:", err));
  };

  // Count users by role and status
  const totalUsers = users.length;
  const totalStudents = users.filter((u) => u.role === "student").length;
  const totalTeachers = users.filter((u) => u.role === "teacher").length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalCourses = courses.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const pendingUsers = users.filter((u) => u.status === "pending").length;
  const blockedUsers = users.filter((u) => u.status === "blocked").length;

  const userStatusData = [
    { name: "Active", value: activeUsers },
    { name: "Pending", value: pendingUsers },
    { name: "Blocked", value: blockedUsers },
  ];

  const userRoleData = [
    { name: "Students", value: totalStudents },
    { name: "Teachers", value: totalTeachers },
    { name: "Admins", value: totalAdmins },
  ];

  const COLORS = ["#4CAF50", "#FFA500", "#F44336"];
  const ROLE_COLORS = ["#2196F3", "#9C27B0", "#FF5722"];

  // Navigation with scroll to top
  const goToPage = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-10 text-center">
          Admin Dashboard
        </h1>

        {/* Notice Board */}
        <div className="mb-10">
          <NoticeBoard />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
          {[
            { title: "Total Users", value: totalUsers, color: "bg-blue-600" },
            { title: "Students", value: totalStudents, color: "bg-green-600" },
            { title: "Teachers", value: totalTeachers, color: "bg-purple-600" },
            { title: "Admins", value: totalAdmins, color: "bg-red-600" },
            { title: "Courses", value: totalCourses, color: "bg-yellow-500" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`bg-white shadow-lg hover:shadow-2xl transition rounded-xl p-6 text-center cursor-pointer border-l-8 ${stat.color}`}
            >
              <h3 className="text-gray-500 text-sm mb-2">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
            <h3 className="text-gray-700 font-semibold mb-4 text-center">
              Users by Status
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                  // removed onClick to make it non-clickable
                >
                  {userStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
            <h3 className="text-gray-700 font-semibold mb-4 text-center">
              Users by Role
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={userRoleData}
                margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {userRoleData.map((entry, index) => (
                    <Cell
                      key={`cell-role-${index}`}
                      fill={ROLE_COLORS[index % ROLE_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { label: "Manage Users", path: "/userManagement", color: "bg-blue-600 hover:bg-blue-700" },
            { label: "Add Notice", path: "/adminNotice", color: "bg-green-600 hover:bg-green-700" },
            { label: "Manage Courses", path: "/create-subject", color: "bg-purple-600 hover:bg-purple-700" },
          ].map((btn, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(btn.path)}
              className={`${btn.color} text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition transform hover:scale-105`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
