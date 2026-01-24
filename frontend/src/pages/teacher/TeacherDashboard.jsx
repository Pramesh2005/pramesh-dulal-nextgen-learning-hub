import { Link } from "react-router-dom"; // import Link
import NoticeBoard from "../../components/NoticeBoard";
import NoticeManager from "../../components/NoticeManager";
import AddAssignment from "../../components/assignment/AddAssignment";

export default function TeacherDashboard() {
  return (
    <div style={{ padding: 50 }}>
      <h1 className="text-2xl font-bold mb-2">Welcome Teacher!</h1>
      <p className="mb-6 text-gray-700">Your account is active. Dashboard coming soon!</p>

      <div className="mb-6">
        <AddAssignment />
      </div>

      <div className="mb-6">
        <NoticeManager />
      </div>

      <div className="mb-6">
        <NoticeBoard />
      </div>

      {/* Button to open ViewSubmissions page */}
      <Link
        to="/view-submissions" // the route for ViewSubmissions
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
      >
        View Submissions
      </Link>
    </div>
  );
}
