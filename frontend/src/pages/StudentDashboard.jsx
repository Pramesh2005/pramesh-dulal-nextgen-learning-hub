export default function StudentDashboard() {
  return (
    <div style={{ padding: 50, textAlign: 'center' }}>
      <h1>Welcome Student!</h1>
      <p>Your account is active. 
        Dashboard coming soon!</p>
        <h4>Coding....</h4>
      <button onClick={() => { localStorage.clear(); window.location.href = '/' }}>Logout</button>
    </div>
  );
}