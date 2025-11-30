import React, { useState } from 'react';
import api from '../api/api';
import { saveToken } from '../auth/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/auth/login', { username, password });
      const token = res.data.token;
      if (token) {
        saveToken(token);
        window.location.href = '/payments';
      } else {
        setError('Token não retornado');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Falha no login');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Entrar</button>
        </div>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
