package com.url.shortener.security.jwt;

import lombok.Data;

public class JwtAuthenticationResponse {
    private String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public JwtAuthenticationResponse(String token) {
        this.token = token;
    }
}
