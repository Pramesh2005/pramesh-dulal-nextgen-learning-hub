import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);

        if (res.data.user.role === 'admin') navigate('/admin');
        else if (res.data.user.role === 'student') navigate('/student');
        else navigate('/teacher');
      }
    } catch (err) {
      const message = err.response?.data?.msg || 'Login failed';
      alert(message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#4f46e5' }}>NextGen Learning Hub</h1>
      <h2 className='text-3xl font-bold text-black-500'>Login</h2>
      <input id="email" placeholder="Email" style={{ padding: 12, width: 320, margin: 10, fontSize: 16 }} /><br/>
      <input id="password" type="password" placeholder="Password" style={{ padding: 12, width: 320, margin: 10, fontSize: 16 }} /><br/>
      <button onClick={handleLogin} style={{ padding: '14px 50px', fontSize: 18, background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
        Login
      </button>

      <p style={{ marginTop: 20 }}>
        Don't have account? {' '}
        <span 
          onClick={() => {
            localStorage.clear();
            window.location.href = '/register';
          }}
          style={{ color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
        >
          Register here
        </span>
      </p>
    </div>
  );
}