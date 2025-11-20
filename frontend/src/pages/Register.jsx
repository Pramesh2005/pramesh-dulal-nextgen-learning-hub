import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = async () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name, email, password, role
      });

      if (res.data.success) {
        alert('Registration successful! Please wait for admin approval.');
        
        navigate('/'); // Go back to login
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '80px' }}>
      <h1>Register</h1>
      <input id="name" placeholder="Full Name" style={{ padding: 10, width: 300, margin: 10 }} /><br/>
      <input id="email" placeholder="Email" style={{ padding: 10, width: 300, margin: 10 }} /><br/>
      <input id="password" type="password" placeholder="Password" style={{ padding: 10, width: 300, margin: 10 }} /><br/>
      <select id="role" style={{ padding: 10, width: 320, margin: 10 }}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select><br/>
      <button onClick={handleRegister} style={{ padding: 15, fontSize: 16 }}>Register</button>
      <p><a href="/">Back to Login</a></p>
    </div>
  );
}