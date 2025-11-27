import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
            <span className="text-white font-bold text-xl">
              NextGen Learning Hub
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {!user && (
              <Link
                to="/"
                className="text-white hover:text-indigo-200 transition"
              >
                Home
              </Link>
            )}

            {!user && (
              <>
                <Link
                  to="/about"
                  className="text-white hover:text-indigo-200 transition"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-white hover:text-indigo-200 transition"
                >
                  Contact
                </Link>
              </>
            )}

            {user?.role && user.role.toUpperCase().includes("ADMIN") && (
              <>
                <Link to="/admin" className="text-white hover:text-indigo-200">
                  Dashboard
                </Link>
                <Link to="" className="text-white hover:text-indigo-200">
                  Users
                </Link>
                <Link to="" className="text-white hover:text-indigo-200">
                  Courses
                </Link>
              </>
            )}

            {user?.role && user.role.toUpperCase().includes("TEACHER") && (
              <>
                <Link
                  to="/teacher"
                  className="text-white hover:text-indigo-200"
                >
                  Dashboard
                </Link>
                <Link to="" className="text-white hover:text-indigo-200">
                  My Classes
                </Link>
              </>
            )}

            {user?.role && user.role.toUpperCase().includes("STUDENT") && (
              <>
                <Link
                  to="/student"
                  className="text-white hover:text-indigo-200"
                >
                  Dashboard
                </Link>
                <Link to="" className="text-white hover:text-indigo-200">
                  My Courses
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white">
                  Hi,{" "}
                  <span className="font-bold capitalize">
                    {user.name?.split(" ")[0]}
                  </span>
                  <span className="ml-2 bg-white/20 px-3 py-1 rounded-full text-xs">
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white/20 backdrop-blur text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/30 transition border border-white/30"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
