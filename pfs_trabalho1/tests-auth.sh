#!/bin/bash

# API Test Script with JWT Authentication
# Base URL
BASE_URL="http://localhost:3000"
TOKEN=""
USER_ID=""

echo "========================================"
echo "API TESTS - aula05-typeorm (WITH AUTH)"
echo "========================================"

# ==================== AUTH TESTS ====================
echo -e "\n=== AUTHENTICATION TESTS ==="

# Test 1: Register new user
echo -e "\n[1] REGISTER USER"
registerResponse=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@example.com","password":"senha123"}')
echo $registerResponse | jq .
USER_ID=$(echo $registerResponse | jq -r '.user.id')

# Test 2: Try duplicate email (should fail 409)
echo -e "\n[2] REGISTER DUPLICATE EMAIL (should fail 409)"
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Outro","email":"joao@example.com","password":"senha456"}' | jq .

# Test 3: Login with valid credentials
echo -e "\n[3] LOGIN - VALID CREDENTIALS"
loginResponse=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha123"}')
echo $loginResponse | jq .
TOKEN=$(echo $loginResponse | jq -r '.token')

# Test 4: Login with wrong password (should fail 401)
echo -e "\n[4] LOGIN - WRONG PASSWORD (should fail 401)"
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"wrongPassword"}' | jq .

# Test 5: Get current authenticated user
echo -e "\n[5] GET CURRENT USER (/auth/me with token)"
curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Test 6: Access protected route without token (should fail 401)
echo -e "\n[6] USERS LIST WITHOUT TOKEN (should fail 401)"
curl -s -X GET "$BASE_URL/users" | jq .

# Test 7: Refresh token
echo -e "\n[7] REFRESH TOKEN"
refreshResponse=$(curl -s -X POST "$BASE_URL/auth/refresh" \
  -H "Authorization: Bearer $TOKEN")
echo $refreshResponse | jq .
TOKEN=$(echo $refreshResponse | jq -r '.token')

# ==================== PUBLIC ROUTES ====================
echo -e "\n=== PUBLIC ROUTES (NO AUTH REQUIRED) ==="

# Test 8: Create Categoria
echo -e "\n[8] CREATE CATEGORIA (public)"
catResponse=$(curl -s -X POST "$BASE_URL/categorias" \
  -H "Content-Type: application/json" \
  -d '{"id":1,"nome":"Eletrônicos"}')
echo $catResponse | jq .

# Test 9: List Categorias (public)
echo -e "\n[9] LIST CATEGORIAS (public)"
curl -s -X GET "$BASE_URL/categorias" \
  -H "Content-Type: application/json" | jq .

# Test 10: Create Produto (public)
echo -e "\n[10] CREATE PRODUTO (public)"
prodResponse=$(curl -s -X POST "$BASE_URL/produtos" \
  -H "Content-Type: application/json" \
  -d '{"id":1,"nome":"Notebook","preco":3500,"categoria":{"id":1},"quantidade":5}')
echo $prodResponse | jq .

# Test 11: List Produtos (public)
echo -e "\n[11] LIST PRODUTOS (public)"
curl -s -X GET "$BASE_URL/produtos" \
  -H "Content-Type: application/json" | jq .

# ==================== PROTECTED ROUTES ====================
echo -e "\n=== PROTECTED ROUTES (REQUIRE VALID JWT) ==="

# Test 12: List Users (with token)
echo -e "\n[12] LIST USERS (with valid token)"
curl -s -X GET "$BASE_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .

# Test 13: Get User by ID (with token)
echo -e "\n[13] GET USER BY ID (with token)"
curl -s -X GET "$BASE_URL/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .

# Test 14: Update User (with token)
echo -e "\n[14] UPDATE USER (with token)"
curl -s -X PUT "$BASE_URL/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"João da Silva","email":"joao.silva@example.com","password":"novasenha123"}' | jq .

# Test 15: Create Pedido (with token)
echo -e "\n[15] CREATE PEDIDO (with token)"
pedResponse=$(curl -s -X POST "$BASE_URL/pedidos" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id":1,"descricao":"Pedido Notebook","produto":{"id":1},"user":{"id":'$USER_ID'},"total":3500}')
echo $pedResponse | jq .

# Test 16: List Pedidos (with token)
echo -e "\n[16] LIST PEDIDOS (with token)"
curl -s -X GET "$BASE_URL/pedidos" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .

# Test 17: Get Pedido by ID (with token)
echo -e "\n[17] GET PEDIDO BY ID (with token)"
curl -s -X GET "$BASE_URL/pedidos/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .

# ==================== ERROR CASES ====================
echo -e "\n=== ERROR CASES ==="

# Test 18: Invalid token format
echo -e "\n[18] INVALID TOKEN FORMAT (should fail 401)"
curl -s -X GET "$BASE_URL/users" \
  -H "Authorization: InvalidToken" \
  -H "Content-Type: application/json" | jq .

# Test 19: Malformed Bearer header
echo -e "\n[19] MALFORMED BEARER HEADER (should fail 401)"
curl -s -X GET "$BASE_URL/users" \
  -H "Authorization: Bearer invalidtoken123invalid" \
  -H "Content-Type: application/json" | jq .

# Test 20: Register with short password (should fail 400)
echo -e "\n[20] SHORT PASSWORD (should fail 400)"
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"123"}' | jq .

# Test 21: Delete Pedido (with token)
echo -e "\n[21] DELETE PEDIDO (with token)"
curl -s -X DELETE "$BASE_URL/pedidos/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .

# Test 22: Delete User (with token)
echo -e "\n[22] DELETE USER (with token)"
curl -s -X DELETE "$BASE_URL/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .

echo -e "\n========================================"
echo "ALL TESTS COMPLETED"
echo "========================================"
echo -e "\nTest Summary:"
echo "✓ Auth tests: Register, Login, Refresh, GetMe"
echo "✓ Public routes: Categorias, Produtos (no auth needed)"
echo "✓ Protected routes: Users, Pedidos (require valid JWT)"
echo "✓ Error cases: Missing token, invalid token, short password"
