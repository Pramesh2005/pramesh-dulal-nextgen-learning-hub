import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaLock, FaGraduationCap, FaSpinner } from "react-icons/fa";

export default function Login({ setUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);

        if (res.data.user.role === "admin") navigate("/admin");
        else if (res.data.user.role === "student") navigate("/student");
        else navigate("/teacher");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-600 to-purple-700">

      {/* LEFT HERO */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center text-white px-16">
        <img
          src="https://img.freepik.com/premium-photo/student-with-laptop-library_647963-5132.jpg"
          alt="Learning"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-md">
          <FaGraduationCap className="text-6xl mb-6 text-indigo-300" />
          <h1 className="text-4xl font-extrabold mb-4">NextGen Learning Hub</h1>
          <p className="text-lg opacity-90 leading-relaxed">
            Learn. Grow. Succeed.
            <br />
            Access your personalized learning dashboard.
          </p>
        </div>
      </div>

      {/* RIGHT LOGIN */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="relative w-full max-w-md">

          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 blur-3xl opacity-30"></div>

          {/* GLASS CARD */}
          <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border border-white/30 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">

            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back 👋</h2>
            <p className="text-white/80 mb-6">Login to continue learning</p>

            {/* ERROR */}
            {error && (
              <div className="mb-4 text-red-300 bg-red-500/20 border border-red-400/30 rounded-lg px-4 py-2 text-sm">
                {error}
              </div>
            )}

            {/* EMAIL */}
            <div className="relative mb-5">
              <FaUserGraduate className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="
                  w-full pl-12 pr-4 py-3 rounded-xl
                  bg-white/10 text-white placeholder-white/50
                  border border-white/25 caret-white
                  focus:ring-2 focus:ring-indigo-400/60
                  outline-none transition
                  selection:bg-indigo-400/40 selection:text-white
                  /* Chrome autofill fix */
                  autofill:bg-transparent autofill:text-white
                  [-webkit-autofill]:bg-white/10
                  [-webkit-autofill]:text-white
                  [-webkit-autofill]:shadow-[0_0_0_1000px_rgba(255,255,255,0.1)_inset]
                  [-webkit-text-fill-color:white]
                "
              />
            </div>

            {/* PASSWORD */}
            <div className="relative mb-6">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                name="user-password"
                className="
                  w-full pl-12 pr-4 py-3 rounded-xl
                  bg-white/10 text-white placeholder-white/50
                  border border-white/25 caret-white
                  focus:ring-2 focus:ring-indigo-400/60
                  outline-none transition
                  selection:bg-indigo-400/40 selection:text-white
                  autofill:bg-transparent autofill:text-white
                  [-webkit-autofill]:bg-white/10
                  [-webkit-autofill]:text-white
                  [-webkit-autofill]:shadow-[0_0_0_1000px_rgba(255,255,255,0.1)_inset]
                  [-webkit-text-fill-color:white]
                "
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition shadow-lg hover:shadow-indigo-500/50 disabled:opacity-60"
            >
              {loading && <FaSpinner className="animate-spin" />}
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* REGISTER */}
            <p className="mt-6 text-center text-white/80">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="font-semibold cursor-pointer underline hover:text-white"
              >
                Register here
              </span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
