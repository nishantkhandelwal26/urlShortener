# Test Login Script
$baseUrl = "http://localhost:8080"

# Test user credentials
$testUser = @{
    username = "testuser"
    password = "password123"
}

# First, try to register the test user
Write-Host "Registering test user..." -ForegroundColor Yellow
$registerBody = @{
    username = $testUser.username
    email = "testuser@example.com"
    password = $testUser.password
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/public/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "Registration successful!" -ForegroundColor Green
} catch {
    Write-Host "Registration failed or user already exists: $($_.Exception.Message)" -ForegroundColor Red
}

# Now try to login with the same credentials
Write-Host "`nAttempting login..." -ForegroundColor Yellow
$loginBody = @{
    username = $testUser.username
    password = $testUser.password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/public/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "Login successful!" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.token)" -ForegroundColor Cyan
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
} 