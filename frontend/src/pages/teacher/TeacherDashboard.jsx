import NoticeBoard from "../../components/NoticeBoard";
import NoticeManager from "../../components/NoticeManager";
import AddAssignment from "../../components/assignment/AddAssignment";
export default function TeacherDashboard() {
  return (
    <div style={{ padding: 50 }}>
      <h1>Welcome Teacher!</h1>
      <p>Your account is active. Dashboard coming soon!</p>
      <AddAssignment />

      <NoticeManager/>
      <NoticeBoard /> 
    </div>
  );
}