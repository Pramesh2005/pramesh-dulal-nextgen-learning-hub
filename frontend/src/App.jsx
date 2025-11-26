import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx';
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div style={{textAlign:'center', marginTop:'200px'}}><h1>Loading...</h1></div>;

  // THIS LINE FIXES THE BUG — ONLY SHOW LOGIN/REGISTER IF NOT LOGGED IN
  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/*" element={<Login setUser={setUser} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // USER IS LOGGED IN → GO TO CORRECT DASHBOARD
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          user.role === 'admin' ? <Navigate to="/admin" /> :
          user.role === 'teacher' ? <Navigate to="/teacher" /> :
          <Navigate to="/student" />
        } />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/register" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;