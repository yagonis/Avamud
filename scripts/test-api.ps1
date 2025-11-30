# test-api.ps1
# Cria um usuário de teste, faz login e chama /actuator/health e /
# Compatível com PowerShell 5.1

param(
    [string]$BaseUrl = "http://localhost:8080",
    [string]$Password = "SenhaTeste123!"
)

function New-RandomDigits([int]$count) {
    -join (1..$count | ForEach-Object { Get-Random -Minimum 0 -Maximum 10 })
}

Write-Host "Base URL: $BaseUrl" -ForegroundColor Cyan

# 1) Testa conectividade TCP
Write-Host 'Verificando conexão com o backend (porta 8080)...' -NoNewline
$test = Test-NetConnection -ComputerName (($BaseUrl -replace 'https?://','').Split(':')[0]) -Port 8080
if (-not $test.TcpTestSucceeded) {
    Write-Host " FALHOU`nVerifique se o backend está rodando em $BaseUrl (porta 8080)." -ForegroundColor Red
    exit 1
}
Write-Host ' OK' -ForegroundColor Green

# 2) Monta dados do usuário com sufixo único para evitar conflitos
$suffix = (Get-Date).ToString('yyyyMMddHHmmss')
$login = "testelocal_$suffix"
$nome = "Teste Local $suffix"
$cpf = New-RandomDigits -count 11
$cnpj = New-RandomDigits -count 14

$user = [pscustomobject]@{
    nome = $nome
    cpf = $cpf
    cnpj = $cnpj
    email = "teste+$suffix@local"
    senha = $Password
    login = $login
    telefone = "000000000"
    dataDeEntrada = (Get-Date).ToString('o')
    addresses = @()
    payments = @()
}

Write-Host "Criando usuário: $login (cpf:$cpf)" -ForegroundColor Yellow
try {
    $userJson = $user | ConvertTo-Json -Depth 6
    $createResp = Invoke-RestMethod -Uri "$BaseUrl/users" -Method Post -Body $userJson -ContentType "application/json"
    Write-Host 'Usuário criado com sucesso:' -ForegroundColor Green
    $createResp | ConvertTo-Json -Depth 6 | Write-Host
} catch {
    Write-Host "Erro ao criar usuário: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        try { $_.Exception.Response.GetResponseStream() | Select-Object -First 1 } catch {}
    }
    Write-Host 'Interrompendo.' -ForegroundColor Red
    exit 1
}

# 3) Login para obter token
Write-Host "Fazendo login com login='$login' e senha='$Password'..." -ForegroundColor Yellow
$loginBody = @{ username = $login; password = $Password } | ConvertTo-Json
try {
    $loginResp = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    if (-not $loginResp.token) {
        Write-Host "Resposta de login inesperada:" -ForegroundColor Red
        $loginResp | ConvertTo-Json -Depth 5 | Write-Host
        exit 1
    }
    $token = $loginResp.token
    Write-Host "Token recebido: $($token.Substring(0,30))..." -ForegroundColor Green
} catch {
    Write-Host "Erro ao logar: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        try { $_.Exception.Response.GetResponseStream() | Select-Object -First 1 } catch {}
    }
    exit 1
}

# 4) Chamar /actuator/health com Authorization
Write-Host "Chamando $BaseUrl/actuator/health com token..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$BaseUrl/actuator/health" -Headers @{ Authorization = "Bearer $token" } -UseBasicParsing
    Write-Host '/actuator/health retorno:' -ForegroundColor Green
    $health | ConvertTo-Json -Depth 5 | Write-Host
} catch {
    Write-Host "Erro ao chamar /actuator/health: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        try { $_.Exception.Response.GetResponseStream() | Select-Object -First 1 } catch {}
    }
}

# 5) Chamar root /
Write-Host "Chamando $BaseUrl/ (root) com token..." -ForegroundColor Yellow
try {
    $root = Invoke-RestMethod -Uri "$BaseUrl" -Headers @{ Authorization = "Bearer $token" } -UseBasicParsing
    Write-Host 'Root (/) retorno:' -ForegroundColor Green
    if ($null -ne $root) { $root | ConvertTo-Json -Depth 5 | Write-Host } else { Write-Host '<empty response>' }
} catch {
    Write-Host "Erro ao chamar /: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "\nResumo: usuário criado: $login ; token (prefixo): $($token.Substring(0,30))..." -ForegroundColor Cyan
Write-Host "Se quiser repetir o teste, execute este script novamente. Para ver o token completo, rode o login manualmente ou altere o script para imprimir o token por inteiro." -ForegroundColor Gray

# fim
