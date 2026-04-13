Write-Host "`n--- 1. HEALTH CHECK ---"
$healthResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/health" -Method Get
Write-Host "Revisión de estado (Health): " ($healthResponse | ConvertTo-Json -Depth 2 -Compress)

Write-Host "`n--- 2. FORGOT PASSWORD ---"
$forgotBody = @{
    email = "test_demo_03@empresa.com"
} | ConvertTo-Json
$forgotResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/forgot-password" -Method Post -Body $forgotBody -ContentType "application/json"
Write-Host "Respuesta: " $forgotResponse.message

Write-Host "`n--- 3. RE-LOGIN PARA OBTENER TOKEN ---"
$loginBody = @{
    email = "test_demo_03@empresa.com"
    password = "MiPassword123!"
} | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$accessToken = $loginResponse.accessToken
Write-Host "Login exitoso. Token asignado."

Write-Host "`n--- 4. GET ME ---"
$headers = @{
    Authorization = "Bearer $accessToken"
}
$meResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/me" -Method Get -Headers $headers
Write-Host "Nombre: " $meResponse.fullName
Write-Host "Tenant vinculado: " $meResponse.tenant.name

Write-Host "`n--- 5. SYNC PROFILE ---"
$syncBody = @{
    tenantSlug = "demo-empresa-03"
    tenantName = "Demo Empresa S.A.S. 3 (Sincronizada)"
    fullName = "Usuario Demo 3 Sincronizado"
    avatarUrl = "https://example.com/avatar.png"
} | ConvertTo-Json
$syncResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/sync-profile" -Method Post -Headers $headers -Body $syncBody -ContentType "application/json"
Write-Host "Perfil Sincronizado para: " $syncResponse.user.email
Write-Host "Nuevo Nombre Usuario: " $syncResponse.user.fullName
Write-Host "Nuevo Nombre Tenant: " $syncResponse.tenant.name
