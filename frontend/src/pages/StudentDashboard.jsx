export default function StudentDashboard() {
  return (
    <div style={{ padding: 50, textAlign: 'center' }}>
      <h1>Welcome Student!</h1>
      <p>Your account is active. 
        Dashboard coming soon!</p>
        <h4>Coding....</h4>
      <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-colors duration-300" onClick={() => { localStorage.clear(); window.location.href = '/' }}>Logout</button>
    </div>
  );
}