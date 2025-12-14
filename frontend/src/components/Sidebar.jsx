import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiMenu,
  HiX,
  HiHome,
  HiUsers,
  HiClipboardList,
  HiCog,
  HiLogout,
} from "react-icons/hi";

export default function Sidebar() {
  const [open, setOpen] = useState(false); // sidebar hidden by default

  const menuItems = [
    { name: "Dashboard", icon: <HiHome />, path: "/dashboard" },
    { name: "Users", icon: <HiUsers />, path: "/" },
    { name: "Notices", icon: <HiClipboardList />, path: "/" },
    { name: "Settings", icon: <HiCog />, path: "/" },
    { name: "Logout", icon: <HiLogout />, path: "/" },
  ];

  return (
    <>
    {/* Toggle Button  */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-5 left-5 z-50 bg-indigo-600 text-white p-2 rounded-md shadow-lg md:hidden"
      >
        {open ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-indigo-50 text-indigo-900 shadow-lg z-40 transform transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 md:static md:w-64
  `}
      >
        <div className="flex flex-col h-full p-5">
          <h2 className="text-2xl font-bold mb-8 text-center text-indigo-800">
            Admin Panel
          </h2>

          <ul className="flex-1 space-y-3">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-indigo-100 rounded transition"
                  onClick={() => setOpen(false)} // close sidebar on click
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
