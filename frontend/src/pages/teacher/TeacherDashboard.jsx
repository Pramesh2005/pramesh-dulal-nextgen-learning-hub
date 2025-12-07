import NoticeBoard from "../../components/NoticeBoard";
import NoticeManager from "../../components/NoticeManager";

export default function TeacherDashboard() {
  return (
    <div style={{ padding: 50 }}>
      <h1>Welcome Teacher!</h1>
      <p>Your account is active. Dashboard coming soon!</p>
      <NoticeManager/>
      <NoticeBoard /> 
    </div>
  );
}