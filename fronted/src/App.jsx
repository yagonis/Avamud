import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Payments from './pages/Payments';

export default function App() {
  return (
    <div>
      <header style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
        <nav>
          <Link to="/">Login</Link> {' | '}
          <Link to="/payments">Payments</Link>
        </nav>
      </header>
      <main style={{ padding: 12 }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/payments" element={<Payments />} />
        </Routes>
      </main>
    </div>
  );
}
