$loginBody = @{
    email = "test_demo_03@empresa.com"
    password = "MiPassword123!"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$accessToken = $loginResponse.accessToken

node debug_jwt.js $accessToken "9ob696NNmmnWyZFPfKETJpLXYNDIj9HlekYRTIKYKheue8L6b4KWZr0qzoFoZu6qxx9Q9uSKB0Bsh5SBww6C5w=="
