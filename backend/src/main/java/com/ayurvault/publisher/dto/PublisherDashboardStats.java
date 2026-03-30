package com.ayurvault.publisher.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublisherDashboardStats {
    private long totalUploads;
    private long totalSales;
    private double totalEarnings;
    private long pendingNotes;
}
