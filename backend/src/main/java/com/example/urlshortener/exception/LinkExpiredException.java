package com.example.urlshortener.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.GONE)
public class LinkExpiredException extends RuntimeException {
    public LinkExpiredException(String shortCode) {
        super("Link expired");
    }
}
