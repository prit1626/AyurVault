package com.ayurvault.publisher.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private long totalNotes;
    private long totalViews;
    private long totalSales;
    private double totalRevenue;
    private List<TrendData> uploadTrend;
    private List<PopularNoteData> popularNotes;

    @Data
    @Builder
    @AllArgsConstructor
    public static class TrendData {
        private String date;
        private int count;
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class PopularNoteData {
        private Long id;
        private String title;
        private long views;
        private long sales;
        private double revenue;
    }
}
