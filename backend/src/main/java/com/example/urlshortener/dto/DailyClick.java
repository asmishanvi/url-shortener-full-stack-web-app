package com.example.urlshortener.dto;

public class DailyClick {
    private String date;
    private Long clicks;

    public DailyClick() {
    }

    public DailyClick(String date, Long clicks) {
        this.date = date;
        this.clicks = clicks;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Long getClicks() {
        return clicks;
    }

    public void setClicks(Long clicks) {
        this.clicks = clicks;
    }
}
