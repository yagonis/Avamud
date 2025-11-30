# Scaffold Frontend (Vite + React) — Guia passo a passo

Este README descreve, passo a passo, como criar um scaffold de frontend usando Vite + React que consome a API deste projeto Spring Boot (Projeto-AVAMUD). Inclui comandos, configuração de CORS mínima no backend, como autenticar com JWT e exemplos de chamadas com `axios`.

**Pré-requisitos**
- Ter Node.js (>=16) e npm ou pnpm instalados.
- Backend em execução localmente (por padrão `http://localhost:8080`).
- (Opcional) Docker se preferir rodar a base de dados MySQL isolada.

**1) Criar o projeto Vite + React**

- No diretório do workspace (recomendado criar pasta `frontend` dentro de `Projeto-AVAMUD`):

```sh
cd /home/yago/Área de trabalho/Avamud-java/Projeto-AVAMUD
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

Obs: se preferir `pnpm` ou `yarn`, adapte os comandos (`pnpm create vite` / `yarn create vite`).

**2) Instalar dependências úteis**

```sh
npm install axios react-router-dom
# opcional para UI: npm install @mui/material @emotion/react @emotion/styled
```

**3) Estrutura mínima sugerida**

- `frontend/`
  - `src/`
    - `main.jsx` (entrada)
    - `App.jsx` (rotas)
    - `pages/Login.jsx` (form de login)
    - `pages/Payments.jsx` (lista de pagamentos)
    - `api/api.js` (cliente axios configurado)
    - `auth/auth.js` (helpers de token)

Crie essas pastas/arquivos conforme abaixo.

**4) Criar `src/api/api.js` — cliente axios**

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

// Interceptor para adicionar Authorization
api.interceptors.request.use(config => {
  const token = localStorage.getItem('avamud_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

**5) Criar `src/auth/auth.js` — helpers de autenticação**

```js
export function saveToken(token) {
  localStorage.setItem('avamud_token', token);
}

export function getToken() {
  return localStorage.getItem('avamud_token');
}

export function clearToken() {
  localStorage.removeItem('avamud_token');
}
```

**6) Exemplo simples de `src/pages/Login.jsx`**

```jsx
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
```

**7) Exemplo simples de `src/pages/Payments.jsx`**

```jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';

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
```

**8) Variáveis de ambiente (Vite)**

- Crie arquivo `.env` (ou `.env.local`) na raiz do `frontend` com:

```
VITE_API_URL=http://localhost:8080
```

**9) Rodar o frontend em desenvolvimento**

```sh
npm run dev
```

O Vite normalmente expõe em `http://localhost:5173`.

**10) Ajustes recomendados no backend antes de integrar**
- Habilitar CORS para o domínio do frontend (ex.: `http://localhost:5173`). Exemplo mínimo para adicionar em `SpringSecurityConfig`:

```java
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.addAllowedOrigin("http://localhost:5173");
    configuration.addAllowedMethod("*");
    configuration.addAllowedHeader("*");
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

- Corrigir `UserController` `@PutMapping` para `@PutMapping("/{id}")` (e retorno correto).
- Corrigir imports duplicados de `@Id` em `Payment`.

**11) Produção / Build**

```sh
npm run build
# o build ficará em frontend/dist
```

Para servir o build a partir do backend, você pode copiar o conteúdo de `frontend/dist` para `src/main/resources/static` do projeto Spring Boot ou configurar um servidor estático (Nginx). Copiar para `static` serve diretamente em `http://localhost:8080/`.

**12) Boas práticas e segurança**
- Armazenamento de token: o exemplo usa `localStorage` (simples, vulnerável a XSS). Para maior segurança use httpOnly cookies e ajuste backend.
- Trate expiração do token (respostas 401 → desalocar token e redirecionar ao login).
- Valide entradas no frontend e sanitize os valores exibidos.

---

Se quiser que eu gere automaticamente o scaffold `frontend/` com os arquivos acima (criando os arquivos, `package.json`, o `.env` e componentes), diga que eu já gero agora e testo (vou criar o scaffold dentro de `Projeto-AVAMUD/frontend`).
