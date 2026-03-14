package com.example.urlshortener.service;

import com.example.urlshortener.exception.AliasAlreadyExistsException;
import com.example.urlshortener.exception.LinkExpiredException;
import com.example.urlshortener.exception.UrlNotFoundException;
import com.example.urlshortener.dto.DailyClick;
import com.example.urlshortener.model.ClickEvent;
import com.example.urlshortener.model.UrlMapping;
import com.example.urlshortener.repository.ClickEventRepository;
import com.example.urlshortener.repository.UrlMappingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class UrlService {
    private static final String ALPHANUM = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int CODE_LENGTH = 6;
    private static final int MAX_ATTEMPTS = 100;
    private static final Pattern CUSTOM_ALIAS_PATTERN = Pattern.compile("^[A-Za-z0-9]{3,30}$");

    private final UrlMappingRepository repository;
    private final ClickEventRepository clickEventRepository;
    private final SecureRandom random = new SecureRandom();

    public UrlService(UrlMappingRepository repository, ClickEventRepository clickEventRepository) {
        this.repository = repository;
        this.clickEventRepository = clickEventRepository;
    }

    public UrlMapping shortenUrl(String originalUrl, String customAlias, LocalDateTime expiresAt) {
        String normalizedUrl = normalizeUrl(originalUrl);
        String shortCode = resolveShortCode(customAlias);

        UrlMapping mapping = new UrlMapping();
        mapping.setOriginalUrl(normalizedUrl);
        mapping.setShortCode(shortCode);
        mapping.setCreatedAt(LocalDateTime.now());
        mapping.setExpiresAt(validateExpiresAt(expiresAt));
        mapping.setClickCount(0L);

        return repository.save(mapping);
    }

    @Transactional
    public String redirect(String shortCode) {
        UrlMapping mapping = repository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException(shortCode));

        if (mapping.getExpiresAt() != null && LocalDateTime.now().isAfter(mapping.getExpiresAt())) {
            throw new LinkExpiredException(shortCode);
        }

        clickEventRepository.save(new ClickEvent(mapping, LocalDateTime.now()));
        mapping.setClickCount(mapping.getClickCount() + 1);
        return mapping.getOriginalUrl();
    }

    public UrlMapping getStats(String shortCode) {
        return repository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException(shortCode));
    }

    public List<UrlMapping> getRecentLinks() {
        return repository.findTop10ByOrderByCreatedAtDesc();
    }

    public List<DailyClick> getDailyClicks(String shortCode) {
        List<Object[]> rows = clickEventRepository.countClicksPerDay(shortCode);
        List<DailyClick> result = new ArrayList<>();
        for (Object[] row : rows) {
            Object dayValue = row[0];
            LocalDate date;
            if (dayValue instanceof java.sql.Date) {
                date = ((java.sql.Date) dayValue).toLocalDate();
            } else if (dayValue instanceof LocalDate) {
                date = (LocalDate) dayValue;
            } else {
                date = LocalDate.parse(dayValue.toString());
            }
            Long count = (Long) row[1];
            result.add(new DailyClick(date.toString(), count));
        }
        return result;
    }

    private String generateUniqueCode() {
        for (int attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
            String code = randomCode();
            if (!repository.existsByShortCode(code)) {
                return code;
            }
        }
        throw new IllegalStateException("Failed to generate unique short code");
    }

    private String randomCode() {
        StringBuilder builder = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            int index = random.nextInt(ALPHANUM.length());
            builder.append(ALPHANUM.charAt(index));
        }
        return builder.toString();
    }

    private String resolveShortCode(String customAlias) {
        if (customAlias == null || customAlias.isBlank()) {
            return generateUniqueCode();
        }
        String trimmed = customAlias.trim();
        if (!CUSTOM_ALIAS_PATTERN.matcher(trimmed).matches()) {
            throw new IllegalArgumentException("Custom alias must be 3-30 alphanumeric characters.");
        }
        if (repository.existsByShortCode(trimmed)) {
            throw new AliasAlreadyExistsException(trimmed);
        }
        return trimmed;
    }

    private LocalDateTime validateExpiresAt(LocalDateTime expiresAt) {
        if (expiresAt == null) {
            return null;
        }
        if (expiresAt.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Expiration must be in the future.");
        }
        return expiresAt;
    }

    private String normalizeUrl(String originalUrl) {
        if (originalUrl == null || originalUrl.isBlank()) {
            throw new IllegalArgumentException("Original URL cannot be empty");
        }
        String trimmed = originalUrl.trim();
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
            return trimmed;
        }
        return "https://" + trimmed;
    }
}
