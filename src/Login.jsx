import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { username, password });
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
      navigate('/products');
    } catch {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: '80px auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: 8 }} />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: 8 }} />
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}