package com.ayurvault.publisher.controller;

import com.ayurvault.publisher.dto.PublisherDashboardStats;
import com.ayurvault.publisher.entity.PublisherTransaction;
import com.ayurvault.publisher.service.PublisherEarningsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/publisher/earnings")
@RequiredArgsConstructor
public class PublisherEarningsController {

    private final PublisherEarningsService earningsService;

    @GetMapping("/stats")
    public ResponseEntity<PublisherDashboardStats> getEarningsStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(earningsService.getEarningsStats(userDetails.getUsername()));
    }

    @GetMapping("/transactions")
    public ResponseEntity<Page<PublisherTransaction>> getTransactionHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(earningsService.getTransactionHistory(userDetails.getUsername(), pageable));
    }
}
