export default function TeacherDashboard() {
  return (
    <div style={{ padding: 50, textAlign: 'center' }}>
      <h1>Welcome Teacher!</h1>
      <p>Your account is active. Dashboard coming soon!</p>
      <button onClick={() => { localStorage.clear(); window.location.href = '/' }}>Logout</button>
    </div>
  );
}