package com.example.urlshortener.repository;

import com.example.urlshortener.model.ClickEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClickEventRepository extends JpaRepository<ClickEvent, Long> {
    @Query("SELECT FUNCTION('date', c.clickedAt), COUNT(c) " +
            "FROM ClickEvent c " +
            "WHERE c.urlMapping.shortCode = :shortCode " +
            "GROUP BY FUNCTION('date', c.clickedAt) " +
            "ORDER BY FUNCTION('date', c.clickedAt)")
    List<Object[]> countClicksPerDay(@Param("shortCode") String shortCode);
}
