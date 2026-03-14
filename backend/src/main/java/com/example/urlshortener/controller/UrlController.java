package com.example.urlshortener.controller;

import com.example.urlshortener.dto.DailyClick;
import com.example.urlshortener.dto.LinkSummary;
import com.example.urlshortener.dto.ShortenRequest;
import com.example.urlshortener.dto.ShortenResponse;
import com.example.urlshortener.dto.StatsResponse;
import com.example.urlshortener.model.UrlMapping;
import com.example.urlshortener.service.UrlService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class UrlController {
    private final UrlService urlService;
    private final String baseUrlOverride;

    public UrlController(UrlService urlService, @Value("${app.base-url:}") String baseUrlOverride) {
        this.urlService = urlService;
        this.baseUrlOverride = baseUrlOverride;
    }

    @PostMapping("/api/shorten")
    public ResponseEntity<ShortenResponse> shortenUrl(@RequestBody ShortenRequest request) {
        UrlMapping mapping = urlService.shortenUrl(
                request.getOriginalUrl(),
                request.getCustomAlias(),
                request.getExpiresAt()
        );
        String baseUrl = baseUrlOverride == null || baseUrlOverride.isBlank()
                ? ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString()
                : baseUrlOverride.trim();
        String shortUrl = baseUrl + "/" + mapping.getShortCode();
        return ResponseEntity.ok(new ShortenResponse(shortUrl));
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode) {
        String originalUrl = urlService.redirect(shortCode);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(originalUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/api/stats/{shortCode}")
    public ResponseEntity<StatsResponse> getStats(@PathVariable String shortCode) {
        UrlMapping mapping = urlService.getStats(shortCode);
        List<DailyClick> dailyClicks = urlService.getDailyClicks(shortCode);
        StatsResponse response = new StatsResponse(
                mapping.getOriginalUrl(),
                mapping.getShortCode(),
                mapping.getCreatedAt(),
                mapping.getClickCount(),
                dailyClicks
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/links")
    public ResponseEntity<List<LinkSummary>> getRecentLinks() {
        List<LinkSummary> links = urlService.getRecentLinks().stream()
                .map(link -> new LinkSummary(
                        link.getOriginalUrl(),
                        link.getShortCode(),
                        link.getCreatedAt(),
                        link.getClickCount()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(links);
    }
}
