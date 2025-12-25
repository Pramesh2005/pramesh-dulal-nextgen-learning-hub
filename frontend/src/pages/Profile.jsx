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
  const [saving, setSaving] = useState(false);

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
    const cleanNickname = nickname.trim();

    if (!cleanNickname) {
      alert("Nickname is required");
      return;
    }

    if (cleanNickname.length < 3 || cleanNickname.length > 20) {
      alert("Nickname must be 3–20 characters long");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanNickname)) {
      alert("Nickname can contain only letters, numbers, and _");
      return;
    }

    setSaving(true);
    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/update-nickname",
        { nickname: cleanNickname },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setUser(res.data.user);
      setNickname(res.data.user.nickname || "");
      setEditingNickname(false);
      alert("Nickname updated successfully!");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to update nickname");
    } finally {
      setSaving(false);
    }
  };
  const canEditNickname = () => {
    if (!user.nicknameUpdatedAt) return true;

    const lastUpdate = new Date(user.nicknameUpdatedAt);
    const hoursPassed = (Date.now() - lastUpdate) / (1000 * 60 * 60);

    return hoursPassed >= 24; // only allow edit if >= 24 hours
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // full updated user
      setUser(res.data.user);
      alert("Profile picture updated!");
    } catch (err) {
      alert(err.response?.data?.msg || "Upload failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert("Both old and new passwords are required");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);

    try {
      //   trimmed values
      const res = await axios.put(
        "http://localhost:5000/api/users/change-password",
        {
          oldPassword: oldPassword.trim(),
          newPassword: newPassword.trim(),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert(res.data.msg);
      setOldPassword("");
      setNewPassword("");
      setShowPasswordModal(false);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
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
            <div className="relative group">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden ring-8 ring-white/50 shadow-2xl">
                <img
                  src={
                    user.avatar
                      ? `http://localhost:5000${user.avatar}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name
                        )}&background=6366f1&color=fff&size=200&rounded=true&bold=true`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}&background=6366f1&color=fff&size=200&rounded=true&bold=true`;
                  }}
                />
              </div>
              <label className="absolute bottom-2 right-2 bg-white p-3 rounded-full shadow-lg cursor-pointer hover:scale-110 transition">
                <HiCamera className="text-indigo-600 text-xl" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                onChange={(e) => handleAvatarUpload(e.target.files[0])}

                />
              </label>
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
                      className="px-4 py-2 border rounded-lg text-black text-lg focus:outline-indigo-400"
                      placeholder="Enter nickname"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={handleNicknameUpdate}
                        disabled={saving}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>

                      <button
                        onClick={() => {
                          setNickname(user.nickname || "");
                          setEditingNickname(false);
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
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
                      onClick={() => {
                        if (canEditNickname()) {
                          setEditingNickname(true);
                        } else {
                          alert(
                            "You can change nickname only once every 24 hours"
                          );
                          localStorage.clear();
                          window.location.href = "/";
                        }
                      }}
                      className={`text-indigo-200 ml-2 ${
                        !canEditNickname()
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:underline"
                      }`}
                      disabled={!canEditNickname()}
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
                <HiShieldCheck />{" "}
                <span className="font-semibold capitalize text-l">
                  {user.role}
                </span>
              </div>

              {/* XP for students */}
              {user.role === "student" && (
                <div className="flex items-center gap-2 text-yellow-300 transition">
                  <HiStar /> <span className="font-bold">0 XP</span>
                </div>
              )}
            </div>
          </div>
          {showPasswordModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-96">
                <h3 className="text-xl font-bold mb-4">Change Password</h3>

                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2 mb-3 border rounded-lg"
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 mb-3 border rounded-lg"
                />

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {changingPassword ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Settings Section */}
          <div className="border-t pt-8">
            <h3 className="text-2xl font-bold mb-6">Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  if (canEditNickname()) {
                    setEditingNickname(true);
                  } else {
                    alert("You can change nickname only once every 24 hours");
                  }
                }}
                className={`w-full px-6 py-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl hover:from-indigo-200 hover:to-purple-200 transition flex items-center gap-4 ${
                  !canEditNickname() ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!canEditNickname()}
              >
                <HiUser className="text-xl text-indigo-600" />
                <span className="font-medium">Change Nick Name</span>
              </button>

              <button className="w-full px-6 py-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl hover:from-indigo-200 hover:to-purple-200 transition flex items-center gap-4">
                <HiCamera className="text-xl text-indigo-600" />
                <span className="font-medium">Update Profile Picture</span>
              </button>

              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl hover:from-indigo-200 hover:to-purple-200 transition flex items-center gap-4"
              >
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
