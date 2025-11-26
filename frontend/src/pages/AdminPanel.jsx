import axios from 'axios';
import { useEffect, useState } from 'react';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/users/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUsers(res.data))
    .catch(err => console.log("Fetch error:", err));
  };

  const approve = (id) => {
    axios.put(`http://localhost:5000/api/users/approve/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => fetchUsers());
  };

  const reject = (id) => {
    axios.put(`http://localhost:5000/api/users/reject/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => fetchUsers())
    .catch(err => console.log("Reject failed:", err));
  };

  return (
    <div style={{ padding: 50 }}>
      <h1 className='text-4xl font-bold text-blue-900'>Admin Panel - User Management</h1>
      <button onClick={fetchUsers} style={{ padding: 10, marginBottom: 20 }}>Refresh List</button>

      <table border="1" style={{ width: '100%', textAlign: 'center' }}>
        <thead style={{ background: '#333', color: 'white' }}>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td style={{ 
                fontWeight: 'bold',
                color: u.status === 'active' ? 'green' : u.status === 'blocked' ? 'red' : 'orange'
              }}>
                {u.status.toUpperCase()}
              </td>
              <td>
                {u.status === 'pending' && (
                  <>
                    <button onClick={() => approve(u._id)} style={{ background:'green', color:'white', margin:5, padding:'8px 15px' }}>
                      Approve
                    </button>
                    <button onClick={() => reject(u._id)} style={{ background:'red', color:'white', margin:5, padding:'8px 15px' }}>
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br /><br />
      <button className='bg-red-600 hover:bg-red-700 transition-all duration-300 text-white px-5 py-2 rounded-lg shadow-md' onClick={() => { localStorage.clear(); window.location.href = '/' }}>
        Logout
      </button>
    </div>
  );
}