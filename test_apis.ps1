# 1. Login
$loginBody = @{
    email = "test_demo_03@empresa.com"
    password = "MiPassword123!"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$accessToken = $loginResponse.accessToken

Write-Host "--- 1. LOGIN EXITOSO ---"
Write-Host "Access Token obtenido: " $accessToken.Substring(0,40) "..."
Write-Host "Usuario Auth ID: " $loginResponse.user.id

# 2. Get Me (Perfil)
$headers = @{
    Authorization = "Bearer $accessToken"
}

$meResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/me" -Method Get -Headers $headers
Write-Host "`n--- 2. GET ME (PERFIL) ---"
Write-Host "Nombre: " $meResponse.fullName
Write-Host "Tenant vinculado: " $meResponse.tenant.name
Write-Host "Rol en DB: " $meResponse.role

# 3. Create Operation
$operationBody = @{
    type = "IMPORT"
    description = "Test Operation 001"
    originCountry = "CN"
    destCountry = "CO"
    valueUsd = 12500.50
} | ConvertTo-Json

$opResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/operations" -Method Post -Headers $headers -Body $operationBody -ContentType "application/json"
Write-Host "`n--- 3. CREAR OPERACION ---"
Write-Host "Operacion ID: " $opResponse.id
Write-Host "Estado Inicial: " $opResponse.status
Write-Host "Tipo: " $opResponse.type

# 4. List Operations
$listResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/operations" -Method Get -Headers $headers
Write-Host "`n--- 4. LISTAR OPERACIONES ---"
Write-Host "Total obtenidas: " $listResponse.meta.total
Write-Host "ID de la primera operacion de la lista: " $listResponse.data[0].id

# 5. Get Operation by ID
$opId = $listResponse.data[0].id
$singleOpResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/operations/$opId" -Method Get -Headers $headers
Write-Host "`n--- 5. OBTENER OPERACION POR ID ---"
Write-Host "ID Recuperado: " $singleOpResponse.id
Write-Host "Descripcion: " $singleOpResponse.description

# 6. Update Operation
$updateBody = @{
    status = "IN_TRANSIT"
    originCountry = "US"
} | ConvertTo-Json
$updatedOpResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/operations/$opId" -Method Put -Headers $headers -Body $updateBody -ContentType "application/json"
Write-Host "`n--- 6. ACTUALIZAR OPERACION (PUT) ---"
Write-Host "Nuevo Estado: " $updatedOpResponse.status
Write-Host "Nuevo Pais Origen: " $updatedOpResponse.originCountry

# 7. Logout
$logoutResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/logout" -Method Post -Headers $headers -ContentType "application/json"
Write-Host "`n--- 7. LOGOUT ---"
Write-Host "Respuesta Logout: " $logoutResponse.message
