# 🔐 Credenciais de Acesso - Sistema AVAMUD

## Usuários de Teste Cadastrados

### 👤 Membro
```
Login: membro
Senha: 123456
Email: membro@avamud.com
```
**Acesso:** Dashboard de membro com upload de comprovantes

---

### 💰 Tesoureiro
```
Login: hermesfons
Senha: 123456
Email: tesoureiro@avamud.com
```
**Acesso:** Dashboard financeiro com visão completa das transações

---

### 🛡️ Administrador
```
Login: admin
Senha: 123456
Email: admin@avamud.com
```
**Acesso:** Painel de administração (CRUD de usuários, configurações)

---

## 🚀 Como Fazer Login

### Passo 1: Acesse o sistema
- Frontend: http://localhost:5173
- Backend: http://localhost:8080

### Passo 2: Selecione o tipo de usuário
Na tela de login, escolha o tipo correspondente:
- **Membro / Associado** (azul)
- **Tesoureiro** (verde)
- **Administrador** (vermelho)

### Passo 3: Digite as credenciais
- **Login/Email**: Use o login acima (ex: `membro`, `tesoureiro`, `admin`)
- **Senha**: `123456` para todos os usuários de teste

### Passo 4: Clique em "Entrar no Sistema"

---

## ⚠️ Solução de Problemas

### Erro: "Credenciais inválidas"
✅ **Verifique:**
1. Está usando o **login** correto (não o email completo)
   - ✅ Correto: `membro`
   - ❌ Errado: `membro@avamud.com`
2. A senha é exatamente `123456`
3. O tipo de usuário selecionado corresponde ao login
   - `membro` → Selecionar "Membro / Associado"
   - `tesoureiro` → Selecionar "Tesoureiro"
   - `admin` → Selecionar "Administrador"

### Erro: "Este usuário não tem permissão de..."
Isso significa que o tipo selecionado não corresponde ao papel do usuário.

**Exemplo:**
- Login: `membro`
- Selecionado: "Administrador" ❌
- Solução: Selecionar "Membro / Associado" ✅

### Backend não responde
```bash
# Verificar se o backend está rodando
curl http://localhost:8080/test/health

# Se não estiver, iniciar:
cd "/home/estagiarioportal1/Área de trabalho/avamud/Avamud"
./mvnw spring-boot:run -Dskip.frontend=true
```

---

## 🧪 Teste da API Diretamente

### Testar Login via cURL:
```bash
# Membro
curl -X POST http://localhost:8080/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"membro","password":"123456"}'

# Tesoureiro
curl -X POST http://localhost:8080/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"hermesfons","password":"123456"}'

# Admin
curl -X POST http://localhost:8080/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"123456"}'
```

**Resposta esperada:**
```json
{
  "token": "eyJhbGc...",
  "username": "membro",
  "role": "membro"
}
```

---

## 🔄 Resetar Senha de um Usuário

Se precisar resetar a senha de qualquer usuário:

```bash
# Via API (Backend rodando):
curl -X POST "http://localhost:8080/test/fix-password/membro?senha=123456"

# Via MySQL diretamente:
mysql --socket=/var/snap/mysql/current/run/mysqld.sock -u avamud -p'Avamud2025!' avamud -e "
UPDATE user 
SET senha = '\$2a\$10\$Buv1kI8MCjae8IwxaDz37ukd28Zy6sRI3MSIxpNyp.GUYDvYVejVm'
WHERE login = 'membro';
"
```

---

## 📝 Notas Importantes

1. **Todos os usuários de teste usam a mesma senha:** `123456`
2. **O campo de login aceita apenas o login, não o email completo**
3. **O papel (role) é determinado automaticamente pelo login:**
   - `admin` → `administrador`
   - `tesoureiro` → `tesoureiro`
   - Qualquer outro → `membro`
4. **As senhas são criptografadas com BCrypt** no banco de dados

---

**✅ Sistema pronto para uso!**
