# Configuração do Banco de Dados - Avamud

Este documento descreve como configurar o banco de dados MySQL para o sistema Avamud.

## Pré-requisitos

- **MySQL 8.0** ou superior instalado
- **Java 17** ou superior
- **Maven** para build do projeto
- **Node.js 18.x** para o frontend React

## Instalação do MySQL

### Windows
1. Baixe o MySQL Installer em: https://dev.mysql.com/downloads/installer/
2. Execute o instalador e escolha a opção "Developer Default"
3. Configure a senha do usuário root durante a instalação
4. Anote a porta (padrão: 3306)

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### macOS
```bash
brew install mysql
brew services start mysql
```

## Configuração do Banco de Dados

### Opção 1: Restaurar Backup com Dados (Recomendado)

Esta opção restaura o banco de dados com todos os usuários e dados já configurados.

#### 1. Acessar o MySQL como root

```bash
mysql -u root -p
```

Digite a senha do root quando solicitado.

#### 2. Criar Usuário e Banco de Dados

```sql
-- Criar o banco de dados
CREATE DATABASE avamud CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário específico para a aplicação
CREATE USER 'avamud'@'localhost' IDENTIFIED BY 'Avamud2025!';

-- Conceder permissões ao usuário
GRANT ALL PRIVILEGES ON avamud.* TO 'avamud'@'localhost';

-- Aplicar as mudanças
FLUSH PRIVILEGES;

-- Sair do MySQL
EXIT;
```

#### 3. Restaurar o Backup

O arquivo `database_backup.sql` contém toda a estrutura e dados do sistema.

**Windows (PowerShell):**
```powershell
mysql -u avamud -p avamud < database_backup.sql
```

**Linux/macOS:**
```bash
mysql -u avamud -p avamud < database_backup.sql
```

Senha: `Avamud2025!`

#### 4. Verificar os Dados

```bash
mysql -u avamud -p avamud
```

```sql
-- Ver todos os usuários cadastrados
SELECT id, login, nome, cpf FROM user;

-- Verificar total de registros
SELECT 
  (SELECT COUNT(*) FROM user) as usuarios,
  (SELECT COUNT(*) FROM address) as enderecos,
  (SELECT COUNT(*) FROM payment) as pagamentos,
  (SELECT COUNT(*) FROM payment_history) as historico;
```

### Opção 2: Configuração Manual (Sem Dados)

Use esta opção se quiser começar com banco de dados vazio.

### 1. Acessar o MySQL

Abra o terminal/prompt e acesse o MySQL:

```bash
mysql -u root -p
```

Digite a senha do root quando solicitado.

### 2. Criar Usuário e Banco de Dados

Execute os seguintes comandos SQL:

```sql
-- Criar o banco de dados
CREATE DATABASE avamud CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário específico para a aplicação
CREATE USER 'avamud'@'localhost' IDENTIFIED BY 'Avamud2025!';

-- Conceder permissões ao usuário
GRANT ALL PRIVILEGES ON avamud.* TO 'avamud'@'localhost';

-- Aplicar as mudanças
FLUSH PRIVILEGES;

-- Verificar se o banco foi criado
SHOW DATABASES;

-- Sair do MySQL
EXIT;
```

### 3. Verificar a Conexão

Teste a conexão com o novo usuário:

```bash
mysql -u avamud -p avamud
```

Senha: `Avamud2025!`

Se conectar com sucesso, a configuração está correta.

## Estrutura do Banco de Dados

O Spring Boot criará automaticamente as tabelas quando a aplicação for iniciada pela primeira vez, graças à configuração `spring.jpa.hibernate.ddl-auto=update`.

### Tabelas Criadas Automaticamente:

1. **user** - Usuários do sistema (administradores, tesoureiros, membros)
   - id, login, senha, nome, cpf, telefone, email, data_de_cadastro

2. **address** - Endereços dos usuários
   - id, logradouro, numero, complemento, bairro, cidade, estado, cep, user_id

3. **payment** - Informações de pagamento
   - id, nome_banco, agencia, conta, tipo_conta, nome_titular, cpf_titular, chave_pix, user_id

4. **payment_history** - Histórico de pagamentos
   - id, valor, data_pagamento, status, descricao, user_id

## Inserir Usuários Iniciais

Após a primeira execução da aplicação (que criará as tabelas), insira os usuários de teste:

```sql
-- Conectar ao banco
mysql -u avamud -p avamud

-- Inserir usuários com senhas criptografadas (senha: 123456)
INSERT INTO user (login, senha, nome, cpf, telefone, email, data_de_cadastro) VALUES
('admin', '$2a$10$YourBCryptHashHere', 'Administrador', '111.111.111-11', '(11) 91111-1111', 'admin@avamud.com', NOW()),
('tesoureiro', '$2a$10$YourBCryptHashHere', 'Tesoureiro', '222.222.222-22', '(11) 92222-2222', 'tesoureiro@avamud.com', NOW()),
('membro', '$2a$10$YourBCryptHashHere', 'Membro', '333.333.333-33', '(11) 93333-3333', 'membro@avamud.com', NOW());
```

**IMPORTANTE**: Use o endpoint `/test/hash-password?password=123456` para gerar hashes BCrypt válidos, ou rode a aplicação e use o TestController para gerar e inserir senhas corretas.

### Método Recomendado: Usar o TestController

1. Inicie a aplicação Spring Boot
2. Use o endpoint para gerar hash:
   ```
   GET http://localhost:8080/test/hash-password?password=123456
   ```
3. Use o hash retornado nos INSERTs acima

Ou use o endpoint para criar usuário diretamente:
```
POST http://localhost:8080/test/fix-password?login=admin&password=123456
```

## Configuração da Aplicação

O arquivo `src/main/resources/application.properties` já está configurado:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/avamud?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false
spring.datasource.username=avamud
spring.datasource.password=Avamud2025!
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

### Personalização

Se precisar alterar as credenciais do banco:

1. Edite `src/main/resources/application.properties`
2. Altere `spring.datasource.username` e `spring.datasource.password`
3. Recrie o usuário MySQL com as novas credenciais

## Executar a Aplicação

### Backend (Spring Boot)

No diretório raiz do projeto:

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/macOS
./mvnw spring-boot:run
```

### Frontend (React)

No diretório `frontend`:

```bash
npm install
npm run dev
```

O frontend estará disponível em: http://localhost:5173

## Credenciais de Acesso

### Se você restaurou o backup:

O banco já contém todos os usuários configurados:

| Usuário | Login | Senha | Tipo |
|---------|-------|-------|------|
| Administrador | admin | 123456 | administrador |
| Tesoureiro | tesoureiro | 123456 | tesoureiro |
| Membro | membro | 123456 | membro |

**Todos os endereços, pagamentos e histórico já estarão cadastrados.**

### Se você configurou manualmente:

Após configurar o banco e inserir os usuários:

| Usuário | Login | Senha | Tipo |
|---------|-------|-------|------|
| Administrador | admin | 123456 | administrador |
| Tesoureiro | tesoureiro | 123456 | tesoureiro |
| Membro | membro | 123456 | membro |

## Troubleshooting

### Erro: "Access denied for user"
- Verifique se o usuário e senha no `application.properties` correspondem ao criado no MySQL
- Confirme que o usuário tem permissões no banco `avamud`

### Erro: "Unknown database 'avamud'"
- Execute o comando `CREATE DATABASE avamud;` no MySQL
- Ou certifique-se de que `createDatabaseIfNotExist=true` está na URL de conexão

### Erro: "Communications link failure"
- Verifique se o MySQL está rodando: `sudo systemctl status mysql` (Linux) ou abra o MySQL Workbench (Windows)
- Confirme a porta (padrão: 3306)
- Verifique se não há firewall bloqueando a conexão

### Senha não funciona no login
- As senhas devem estar em formato BCrypt (60 caracteres)
- Use o endpoint `/test/fix-password` para corrigir senhas
- Exemplo: `POST http://localhost:8080/test/fix-password?login=admin&password=123456`

### Tabelas não são criadas
- Verifique se `spring.jpa.hibernate.ddl-auto=update` está no `application.properties`
- Confira os logs da aplicação para erros de conexão
- Certifique-se de que as entidades estão anotadas corretamente com `@Entity`

## Segurança

### Produção

Antes de colocar em produção:

1. **Remova o TestController** (`src/main/java/com/avamud/controller/TestController.java`)
2. **Altere as senhas padrão** de todos os usuários
3. **Mude as credenciais do banco** e a chave JWT no `application.properties`
4. **Configure SSL/TLS** para conexões MySQL
5. **Use variáveis de ambiente** para credenciais sensíveis:

```properties
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
projeto.jwtSecret=${JWT_SECRET}
```

### Backup

O arquivo `database_backup.sql` na raiz do projeto contém um backup completo com dados de exemplo.

Para criar novos backups:

**Windows (PowerShell):**
```powershell
mysqldump -u avamud -p"Avamud2025!" --no-tablespaces avamud > "backup_avamud_$(Get-Date -Format 'yyyyMMdd').sql"
```

**Linux/macOS:**
```bash
mysqldump -u avamud -p --no-tablespaces avamud > backup_avamud_$(date +%Y%m%d).sql
```

Para restaurar um backup:

**Windows:**
```powershell
mysql -u avamud -p avamud < backup_avamud_20241130.sql
```

**Linux/macOS:**
```bash
mysql -u avamud -p avamud < backup_avamud_20241130.sql
```

## Suporte

Para problemas ou dúvidas:
- Verifique os logs da aplicação Spring Boot
- Consulte a documentação do MySQL: https://dev.mysql.com/doc/
- Revise o arquivo `application.properties` para configurações incorretas
