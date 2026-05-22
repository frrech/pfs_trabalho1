$BASE_URL = "http://localhost:3000/api"
$TOKEN = $null
$USER_ID = $null

$uniqueSuffix = Get-Date -Format 'yyyyMMddHHmmss'
$TEST_EMAIL = "joao.test.$uniqueSuffix@example.com"

function Invoke-Api {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string] $Method,
        [Parameter(Mandatory)][string] $Uri,
        [object] $Body = $null,
        [string] $Token = $null
    )

    $headers = @{ "Content-Type" = "application/json" }
    if ($Token) { $headers.Authorization = "Bearer $Token" }

    $bodyText = $null
    if ($Body -ne $null) {
        $bodyText = $Body | ConvertTo-Json -Depth 5
    }

    try {
        $response = Invoke-RestMethod -Method $Method -Uri $Uri -Headers $headers -Body $bodyText -ErrorAction Stop
        return @{ Status = 200; Body = $response }
    }
    catch {
        $errorResponse = $_.Exception.Response
        if ($errorResponse -ne $null) {
            $statusCode = $errorResponse.StatusCode.value__
            $stream = New-Object System.IO.StreamReader($errorResponse.GetResponseStream())
            $contents = $stream.ReadToEnd()
            $stream.Close()

            try {
                $parsed = $contents | ConvertFrom-Json
            }
            catch {
                $parsed = $contents
            }

            return @{ Status = $statusCode; Body = $parsed }
        }

        return @{ Status = 0; Body = $_.Exception.Message }
    }
}

function Print-Result {
    param(
        [int] $Index,
        [string] $Label,
        [hashtable] $Result,
        [string] $ExpectedStatus = ""
    )

    $statusColor = "Green"
    if ($Result.Status -ge 400) { $statusColor = "Red" }
    elseif ($Result.Status -ge 300) { $statusColor = "Yellow" }

    Write-Host "[$Index] $Label" -ForegroundColor Cyan
    Write-Host "Status: $($Result.Status)" -ForegroundColor $statusColor
    
    if ($ExpectedStatus) {
        Write-Host "Expected: $ExpectedStatus" -ForegroundColor Gray
    }

    Write-Host "Response:" -ForegroundColor Gray
    if ($Result.Body -is [string]) {
        Write-Host $Result.Body -ForegroundColor White
    }
    else {
        $Result.Body | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor White
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "API TESTS - aula05-typeorm (WITH AUTH)" -ForegroundColor Cyan
Write-Host "========================================`n"

Write-Host "=== AUTHENTICATION TESTS ===" -ForegroundColor Magenta

$registerResult = Invoke-Api -Method POST -Uri "$BASE_URL/auth/register" -Body @{
    name = "João Silva"
    email = $TEST_EMAIL
    password = "senha123"
}
Print-Result 1 "REGISTER USER" $registerResult "201"
if ($registerResult.Status -in 200,201 -and $registerResult.Body.user) {
    $USER_ID = $registerResult.Body.user.id
}

$duplicateResult = Invoke-Api -Method POST -Uri "$BASE_URL/auth/register" -Body @{
    name = "Outro"
    email = $TEST_EMAIL
    password = "senha456"
}
Print-Result 2 "REGISTER DUPLICATE EMAIL (should fail)" $duplicateResult "409"

$loginResult = Invoke-Api -Method POST -Uri "$BASE_URL/auth/login" -Body @{
    email = $TEST_EMAIL
    password = "senha123"
}
Print-Result 3 "LOGIN - VALID CREDENTIALS" $loginResult "200"
if ($loginResult.Status -eq 200 -and $loginResult.Body.token) {
    $TOKEN = $loginResult.Body.token
}

$wrongLogin = Invoke-Api -Method POST -Uri "$BASE_URL/auth/login" -Body @{
    email = $TEST_EMAIL
    password = "wrongPassword"
}
Print-Result 4 "LOGIN - WRONG PASSWORD (should fail)" $wrongLogin "401"

$meResult = Invoke-Api -Method GET -Uri "$BASE_URL/auth/me" -Token $TOKEN
Print-Result 5 "GET CURRENT USER (/auth/me)" $meResult "200"

$noTokenUsers = Invoke-Api -Method GET -Uri "$BASE_URL/users"
Print-Result 6 "USERS LIST WITHOUT TOKEN (should fail)" $noTokenUsers "401"

$refreshResult = Invoke-Api -Method POST -Uri "$BASE_URL/auth/refresh" -Body @{
    token = $TOKEN
}
Print-Result 7 "REFRESH TOKEN" $refreshResult "200"
if ($refreshResult.Status -eq 200 -and $refreshResult.Body.token) {
    $TOKEN = $refreshResult.Body.token
}

Write-Host "=== PUBLIC ROUTES ===" -ForegroundColor Magenta

$catResult = Invoke-Api -Method POST -Uri "$BASE_URL/categoria" -Body @{
    nome = "Eletrônicos Test"
}
Print-Result 8 "CREATE CATEGORIA" $catResult "201"

$listCatResult = Invoke-Api -Method GET -Uri "$BASE_URL/categoria"
Print-Result 9 "LIST CATEGORIAS" $listCatResult "200"

$prodResult = Invoke-Api -Method POST -Uri "$BASE_URL/produto" -Body @{
    nome = "Notebook Test"
    preco = 3500
    quantidade = 5
    categoria = 1
}
Print-Result 10 "CREATE PRODUTO" $prodResult "201"

$listProdResult = Invoke-Api -Method GET -Uri "$BASE_URL/produto"
Print-Result 11 "LIST PRODUTOS" $listProdResult "200"

Write-Host "=== PROTECTED ROUTES ===" -ForegroundColor Magenta

$listUsersResult = Invoke-Api -Method GET -Uri "$BASE_URL/users" -Token $TOKEN
Print-Result 12 "LIST USERS (with token)" $listUsersResult "200"

if ($USER_ID) {
    $getUserResult = Invoke-Api -Method GET -Uri "$BASE_URL/users/$USER_ID" -Token $TOKEN
    Print-Result 13 "GET USER BY ID" $getUserResult "200"
    
    $updateUserResult = Invoke-Api -Method PUT -Uri "$BASE_URL/users/$USER_ID" -Token $TOKEN -Body @{
        name = "João da Silva Updated"
        email = "joao.silva.updated.$uniqueSuffix@example.com"
        password = "novasenha123"
    }
    Print-Result 14 "UPDATE USER" $updateUserResult "200"
} else {
    Write-Host "[13] GET USER BY ID skipped - USER_ID missing" -ForegroundColor Yellow
    Write-Host "[14] UPDATE USER skipped - USER_ID missing" -ForegroundColor Yellow
}

$pedidoResult = Invoke-Api -Method POST -Uri "$BASE_URL/pedidos" -Token $TOKEN -Body @{
    descricao = "Pedido Notebook"
    produtos = @(@{ id = 1 })
    user = @{ id = $USER_ID }
    total = 3500
}
Print-Result 15 "CREATE PEDIDO" $pedidoResult "201"

$listPedidosResult = Invoke-Api -Method GET -Uri "$BASE_URL/pedidos" -Token $TOKEN
Print-Result 16 "LIST PEDIDOS" $listPedidosResult "200"

$getPedidoResult = Invoke-Api -Method GET -Uri "$BASE_URL/pedidos/1" -Token $TOKEN
Print-Result 17 "GET PEDIDO BY ID" $getPedidoResult "200"

Write-Host "=== ERROR CASES ===" -ForegroundColor Magenta

$invalidFormatResult = Invoke-Api -Method GET -Uri "$BASE_URL/users" -Token "InvalidToken"
Print-Result 18 "INVALID TOKEN FORMAT" $invalidFormatResult "401"

$malformedBearerResult = Invoke-Api -Method GET -Uri "$BASE_URL/users" -Token "invalidtoken123invalid"
Print-Result 19 "MALFORMED BEARER HEADER" $malformedBearerResult "401"

$shortPassResult = Invoke-Api -Method POST -Uri "$BASE_URL/auth/register" -Body @{
    name = "Test"
    email = "test.short.$uniqueSuffix@example.com"
    password = "123"
}
Print-Result 20 "SHORT PASSWORD (should fail)" $shortPassResult "400"

if ($USER_ID) {
    $deletePedidoResult = Invoke-Api -Method DELETE -Uri "$BASE_URL/pedidos/1" -Token $TOKEN
    Print-Result 21 "DELETE PEDIDO" $deletePedidoResult "200"

    $deleteUserResult = Invoke-Api -Method DELETE -Uri "$BASE_URL/users/$USER_ID" -Token $TOKEN
    Print-Result 22 "DELETE USER" $deleteUserResult "200"
} else {
    Write-Host "[21] DELETE PEDIDO skipped - USER_ID missing" -ForegroundColor Yellow
    Write-Host "[22] DELETE USER skipped - USER_ID missing" -ForegroundColor Yellow
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTS COMPLETED" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan