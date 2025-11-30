import React from 'react';

export function InfoDropdown() {
  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <details>
        <summary className="cursor-pointer font-medium">Informações</summary>
        <div className="mt-2 text-sm text-gray-700">Lorem ipsum — informações sobre AVAMUD.</div>
      </details>
    </div>
  );
}

export default InfoDropdown;
