import { useState, useEffect } from "react";
import axios from "axios";
import {
  HiCamera,
  HiUser,
  HiMail,
  HiShieldCheck,
  HiStar,
  HiLogout,
  HiLockClosed,
} from "react-icons/hi";
import contactHero from "../assets/contactHero.png";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editingNickname, setEditingNickname] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data.user);
          setNickname(res.data.user.nickname || "");
        })
        .catch(() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        });
    }
  }, []);

  const handleNicknameUpdate = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/users/update-nickname",
        { nickname },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUser({ ...user, nickname });
      setEditingNickname(false);
      alert("Nickname updated successfully!");
    } catch (err) {
      alert("Failed to update nickname");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  if (!user)
    return (
      <div className="text-center mt-32 text-2xl font-semibold">Loading...</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-indigo-700 drop-shadow-md">
          My Profile
        </h1>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 transition-all hover:shadow-3xl">
          {/* Profile Header with Background */}
          <div
            className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12 rounded-2xl overflow-hidden relative"
            style={{
              backgroundImage: `url(${contactHero})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

            {/* Avatar */}
            <div className="relative z-10 group">
              <div className="w-36 h-36 md:w-44 md:h-44 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-5xl md:text-6xl font-bold shadow-lg transition-transform hover:scale-105">
                {capitalizeFirstLetter(user.name).charAt(0)}
              </div>
              <button className="absolute bottom-2 right-2 bg-white p-2 md:p-3 rounded-full shadow-md hover:scale-110 transition duration-300">
                <HiCamera className="text-indigo-600 text-lg md:text-xl" />
              </button>
            </div>

            {/* User Info */}
            <div className="text-center md:text-left flex-1 z-10 text-white drop-shadow-md space-y-2">
              {/* Name */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  {capitalizeFirstLetter(user.name)}
                </h2>
              </div>

              {/* Nickname */}
              <div>
                {editingNickname ? (
                  <div className="flex flex-col md:flex-row items-center gap-2">
                    <input
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="px-4 py-2 border rounded-lg text-lg md:text-xl focus:outline-indigo-400"
                      placeholder="Nickname"
                    />
                    <div className="flex gap-2 mt-1 md:mt-0">
                      <button
                        onClick={handleNicknameUpdate}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNickname(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-200 text-xl">
                      ({nickname || "No Nickname"})
                    </span>
                    <button
                      onClick={() => setEditingNickname(true)}
                      className="text-indigo-200 hover:underline ml-2"
                    >
                      Edit Nickname
                    </button>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="flex items-center gap-2 text-indigo-100 hover:text-indigo-200 transition">
                <HiMail /> {user.email}
              </div>

              {/* Verified / Role */}
              <div className="flex items-center gap-2 text-white transition">
                <HiShieldCheck /> <span className="font-semibold capitalize text-l">{user.role}</span>
              </div>

              {/* XP for students */}
              {user.role === "student" && (
                <div className="flex items-center gap-2 text-yellow-300 transition">
                  <HiStar /> <span className="font-bold">0 XP</span>
                </div>
              )}
            </div>
          </div>

          {/* Settings Section */}
          <div className="border-t pt-8">
            <h3 className="text-2xl font-bold mb-6">Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="w-full px-6 py-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl hover:from-indigo-200 hover:to-purple-200 transition flex items-center gap-4">
                <HiUser className="text-xl text-indigo-600" />
                <span className="font-medium">Change Name</span>
              </button>

              <button className="w-full px-6 py-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl hover:from-indigo-200 hover:to-purple-200 transition flex items-center gap-4">
                <HiCamera className="text-xl text-indigo-600" />
                <span className="font-medium">Update Profile Picture</span>
              </button>

              <button className="w-full px-6 py-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl hover:from-indigo-200 hover:to-purple-200 transition flex items-center gap-4">
                <HiLockClosed className="text-xl text-indigo-600" />
                <span className="font-medium">Change Password</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-6 py-4 bg-red-600 rounded-xl hover:bg-red-700 transition flex items-center gap-4"
              >
                <HiLogout className="text-xl text-white" />
                <span className="font-medium text-white">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
