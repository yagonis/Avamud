import React, { useState } from 'react';
import api from '../api/api';
import { saveToken } from '../auth/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { username, password });
      saveToken(res.data.token);
      // redirecione para /payments ou onde quiser
      window.location.href = '/payments';
    } catch (err) {
      setError('Falha no login');
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" />
        <button type="submit">Entrar</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}