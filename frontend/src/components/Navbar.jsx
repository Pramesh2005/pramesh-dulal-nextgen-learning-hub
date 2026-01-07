import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { HiLogout } from "react-icons/hi";
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
                <Link
                  to="/admin/uploads"
                  className="text-white hover:text-indigo-200"
                >
                  Tracker
                </Link>
                <Link
                  to="/create-subject"
                  className="text-white hover:text-indigo-200"
                >
                  Subject
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
                <Link
                  to="/teacher-subject"
                  className="text-white hover:text-indigo-200"
                >
                  Classes
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
                 <Link
                  to="/student-available-exam"
                  className="text-white hover:text-indigo-200"
                >
                  Exams
                </Link>
                <Link
                  to="/student-course"
                  className="text-white hover:text-indigo-200"
                >
                  My Courses
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                {/* Hi box with dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 text-white font-semibold px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition">
                    Hi, {user.name?.split(" ")[0]}
                    <span className="ml-1 bg-white/30 px-2 py-0.5 rounded-full text-xs">
                      {user.role}
                    </span>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>

                {/* Always visible logout button */}
               <button
  onClick={handleLogout}
  className="w-full px-3 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition flex items-center gap-2"
>
  <HiLogout className="text-xl text-white" />
  <span className="font-medium">Logout</span>
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
