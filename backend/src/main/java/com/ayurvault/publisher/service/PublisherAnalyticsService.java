package com.ayurvault.publisher.service;

import com.ayurvault.publisher.dto.AnalyticsResponse;
import com.ayurvault.publisher.repository.PublisherNoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PublisherAnalyticsService {

    private final PublisherNoteRepository publisherNoteRepository;

    public AnalyticsResponse getAnalytics(String email) {
        List<com.ayurvault.publisher.entity.PublisherNote> notes = publisherNoteRepository.findByCreatedByIgnoreCase(email);
        
        long totalNotes = notes.size();
        long totalViews = notes.stream()
                .mapToLong(n -> n.getViewsCount() != null ? n.getViewsCount() : 0L)
                .sum();
        long totalSales = notes.stream()
                .mapToLong(n -> n.getPurchaseCount() != null ? n.getPurchaseCount() : 0L)
                .sum();
        double totalRevenue = notes.stream()
                .map(n -> n.getTotalRevenue() != null ? n.getTotalRevenue() : java.math.BigDecimal.ZERO)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add)
                .doubleValue();

        List<AnalyticsResponse.TrendData> trend = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
        for (int i = 6; i >= 0; i--) {
            final int dayOffset = i;
            trend.add(new AnalyticsResponse.TrendData(
                LocalDate.now().minusDays(dayOffset).format(formatter),
                (int) notes.stream()
                        .filter(n -> n.getCreatedAt() != null && n.getCreatedAt().toLocalDate().isEqual(LocalDate.now().minusDays(dayOffset)))
                        .count()
            ));
        }

        List<AnalyticsResponse.PopularNoteData> popular = notes.stream()
                .sorted((a, b) -> Long.compare(
                        b.getViewsCount() != null ? b.getViewsCount() : 0L, 
                        a.getViewsCount() != null ? a.getViewsCount() : 0L))
                .limit(5)
                .map(n -> new AnalyticsResponse.PopularNoteData(
                        n.getId(), 
                        n.getTitle(), 
                        n.getViewsCount() != null ? n.getViewsCount() : 0L, 
                        n.getPurchaseCount() != null ? n.getPurchaseCount() : 0L, 
                        n.getTotalRevenue() != null ? n.getTotalRevenue().doubleValue() : 0.0))
                .toList();

        return AnalyticsResponse.builder()
                .totalNotes(totalNotes)
                .totalViews(totalViews)
                .totalSales(totalSales)
                .totalRevenue(totalRevenue)
                .uploadTrend(trend)
                .popularNotes(popular)
                .build();
    }
}
