import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { clearToken } from '../auth/auth';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/payments')
      .then((res) => setPayments(res.data))
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          // token inválido/expirado
          clearToken();
          window.location.href = '/';
        } else {
          setError('Erro ao carregar pagamentos');
        }
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Payments</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {payments.map((p) => (
          <li key={p.id}>{p.id} — {String(p.valor)} — {p.dataPagamento}</li>
        ))}
      </ul>
    </div>
  );
}
