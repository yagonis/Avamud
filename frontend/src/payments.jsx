import React, { useEffect, useState } from 'react';
import api from '..api/api'

export default function Payments() {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
    api.get('/payments')
      .then(r => setPayments(r.data))
      .catch(e => { if (e.response && e.response.status === 401) window.location.href = '/'; });
  }, []);

  return (
    <div>
      <h2>Payments</h2>
      <ul>
        {payments.map(p => (
          <li key={p.id}>{p.id} — {p.valor} — {p.dataPagamento}</li>
        ))}
      </ul>
    </div>
  );
}