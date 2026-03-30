package com.ayurvault.publisher.controller;

import com.ayurvault.publisher.dto.AnalyticsResponse;
import com.ayurvault.publisher.service.PublisherAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/publisher/analytics")
@RequiredArgsConstructor
public class PublisherAnalyticsController {

    private final PublisherAnalyticsService publisherAnalyticsService;

    @GetMapping
    public ResponseEntity<AnalyticsResponse> getAnalytics(
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        return ResponseEntity.ok(publisherAnalyticsService.getAnalytics(email));
    }
}
