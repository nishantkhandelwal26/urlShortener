# Test MyUrls Endpoint Script
$baseUrl = "http://localhost:8080"

# Test user credentials
$testUser = @{
    username = "testuser"
    password = "password123"
}

# First, login to get the token
Write-Host "Logging in to get token..." -ForegroundColor Yellow
$loginBody = @{
    username = $testUser.username
    password = $testUser.password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/public/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Login successful! Token received." -ForegroundColor Green
    
    # Now test the myUrls endpoint with the token
    Write-Host "`nTesting myUrls endpoint..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $myUrlsResponse = Invoke-RestMethod -Uri "$baseUrl/api/urls/myUrls" -Method GET -Headers $headers
    Write-Host "MyUrls endpoint successful!" -ForegroundColor Green
    Write-Host "Response: $($myUrlsResponse | ConvertTo-Json -Depth 3)" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
    }
} 