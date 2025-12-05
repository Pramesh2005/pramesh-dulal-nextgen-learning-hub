import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';
import About from './static/About.jsx'
import Contact from './static/Contact.jsx';
import Landing from './static/Landing.jsx';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CreateSubject from './pages/admin/CreateSubject.jsx';
import TeacherSubject from './pages/teacher/Subject.jsx'
import StudentCourse from './pages/students/StudentCourse.jsx'

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
    return (
      <BrowserRouter>
      <Navbar user={user} setUser={setUser}/>
        <Routes>
        <Route path="/" element={
          user?.role === 'admin' ? <Navigate to="/admin" /> :
          user?.role === 'teacher' ? <Navigate to="/teacher" /> :
          user?.role === 'student' ? <Navigate to="/student" /> :
          <Landing />
        } />

        
          <Route path="/register" element={user? <Navigate to="/" /> : <Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/create-subject" element={<CreateSubject />} />
          <Route path="/teacher-subject" element={<TeacherSubject />} />
          <Route path="/student-course" element={<StudentCourse />} />


          <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />

          <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
          <Route path="/student" element={user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/" />} />
          <Route path="/teacher" element={user?.role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/" />} />

        </Routes>
        <Footer/>
      </BrowserRouter>
    );
  }


export default App;
