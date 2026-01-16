import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUserAlt,
  FaEnvelope,
  FaLock,
  FaUserGraduate,
  FaSpinner
} from "react-icons/fa";
import RegisterPhoto from "../assets/register.jpg";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role
      });

      if (res.data.success) {
        alert("Registration successful! Please wait for admin approval.");
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = `
    w-full pl-12 pr-4 py-3 rounded-xl
    bg-white/10 text-white placeholder-white/60
    border border-white/25 caret-white
    focus:ring-2 focus:ring-indigo-400/60 outline-none transition
    [-webkit-autofill]:bg-white/10
    [-webkit-autofill]:text-white
    [-webkit-autofill]:shadow-[0_0_0_1000px_rgba(255,255,255,0.1)_inset]
    [-webkit-text-fill-color:white]
  `;

  const selectClasses = `
    w-full pl-12 pr-4 py-3 rounded-xl
    bg-white/10 text-white border border-white/25
    focus:ring-2 focus:ring-indigo-400/60 outline-none transition
    appearance-none cursor-pointer
  `;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-600 to-purple-700">

      {/* LEFT HERO */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center text-white px-16">
        <img
          src={RegisterPhoto}
          alt="Register Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-md">
          <FaUserGraduate className="text-6xl mb-6 text-indigo-300" />
          <h1 className="text-4xl font-extrabold mb-4">
            Join NextGen Learning
          </h1>
          <p className="text-lg opacity-90 leading-relaxed">
            Create your account and start learning today.
            <br />
            Choose your role to get personalized access.
          </p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="relative w-full max-w-md">

          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 blur-3xl opacity-30"></div>

          {/* Glass Card */}
          <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border border-white/30 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">

            <h2 className="text-3xl font-bold text-white mb-2">
              Create Account 👋
            </h2>
            <p className="text-white/80 mb-6">
              Register to start your journey
            </p>

            {/* ERROR */}
            {error && (
              <div className="mb-4 text-red-300 bg-red-500/20 border border-red-400/30 rounded-lg px-4 py-2 text-sm">
                {error}
              </div>
            )}

            {/* NAME */}
            <div className="relative mb-5">
              <FaUserAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClasses}
              />
            </div>

            {/* EMAIL */}
            <div className="relative mb-5">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className={inputClasses}
              />
            </div>

            {/* PASSWORD */}
            <div className="relative mb-5">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className={inputClasses}
              />
            </div>

            {/* ROLE (FIXED DROPDOWN) */}
            <div className="relative mb-6">
              <FaUserGraduate className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={selectClasses}
              >
                <option value="student" className="bg-gray-900 text-white">
                  Student
                </option>
                <option value="teacher" className="bg-gray-900 text-white">
                  Teacher
                </option>
              </select>
            </div>

            {/* REGISTER BUTTON */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2
                bg-gradient-to-r from-indigo-500 to-purple-500
                hover:from-indigo-600 hover:to-purple-600
                text-white font-semibold py-3 rounded-xl
                transition shadow-lg hover:shadow-indigo-500/50
                disabled:opacity-60"
            >
              {loading && <FaSpinner className="animate-spin" />}
              {loading ? "Registering..." : "Register"}
            </button>

            {/* LOGIN LINK */}
            <p className="mt-6 text-center text-white/80">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/")}
                className="font-semibold cursor-pointer underline hover:text-white"
              >
                Login here
              </span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
