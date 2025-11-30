import React from 'react';

export function LoginCard({ onLogin }) {
  const handleFakeLogin = () => {
    // fake login: call onLogin with example user
    onLogin('membro', 'Usuário Teste');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Entrar</h3>
      <button className="btn btn-primary" onClick={handleFakeLogin}>Entrar (dev)</button>
    </div>
  );
}

export default LoginCard;
