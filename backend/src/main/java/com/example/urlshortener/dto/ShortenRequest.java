package com.example.urlshortener.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

public class ShortenRequest {
    private String originalUrl;
    private String customAlias;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private java.time.LocalDateTime expiresAt;

    public ShortenRequest() {
    }

    public ShortenRequest(String originalUrl, String customAlias, java.time.LocalDateTime expiresAt) {
        this.originalUrl = originalUrl;
        this.customAlias = customAlias;
        this.expiresAt = expiresAt;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public String getCustomAlias() {
        return customAlias;
    }

    public void setCustomAlias(String customAlias) {
        this.customAlias = customAlias;
    }

    public java.time.LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(java.time.LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}
