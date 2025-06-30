# Test script for registration API

Write-Host "Testing Registration API..." -ForegroundColor Green

# Test 1: Register a new user
Write-Host "`nTest 1: Registering new user 'testuser3'..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/public/register" -Method POST -ContentType "application/json" -Body '{"username":"testuser3","email":"test3@example.com","password":"password123"}'
    Write-Host "SUCCESS: $response" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Try to register with duplicate username
Write-Host "`nTest 2: Trying to register with duplicate username 'testuser3'..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/public/register" -Method POST -ContentType "application/json" -Body '{"username":"testuser3","email":"test4@example.com","password":"password123"}'
    Write-Host "SUCCESS: $response" -ForegroundColor Green
} catch {
    Write-Host "EXPECTED ERROR (400): $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 3: Try to register with duplicate email
Write-Host "`nTest 3: Trying to register with duplicate email 'test3@example.com'..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/public/register" -Method POST -ContentType "application/json" -Body '{"username":"testuser4","email":"test3@example.com","password":"password123"}'
    Write-Host "SUCCESS: $response" -ForegroundColor Green
} catch {
    Write-Host "EXPECTED ERROR (400): $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 4: Register another new user
Write-Host "`nTest 4: Registering another new user 'testuser5'..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/public/register" -Method POST -ContentType "application/json" -Body '{"username":"testuser5","email":"test5@example.com","password":"password123"}'
    Write-Host "SUCCESS: $response" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nRegistration API testing completed!" -ForegroundColor Green 