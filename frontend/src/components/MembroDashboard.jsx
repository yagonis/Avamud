import React from 'react';

export function MembroDashboard({ userName, onLogout }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl">Painel do Membro</h2>
      <p>Bem-vindo, {userName}</p>
      <button onClick={onLogout} className="mt-4">Sair</button>
    </div>
  );
}

export default MembroDashboard;
