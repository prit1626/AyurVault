package com.ayurvault.publisher.service;

import com.ayurvault.publisher.dto.PublisherDashboardStats;
import com.ayurvault.publisher.entity.PublisherTransaction;
import com.ayurvault.publisher.repository.PublisherTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PublisherEarningsService {

    private final PublisherTransactionRepository transactionRepository;

    public PublisherDashboardStats getEarningsStats(String publisherEmail) {
        List<PublisherTransaction> transactions = transactionRepository.findByPublisherEmail(publisherEmail);
        
        BigDecimal totalEarnings = transactions.stream()
                .map(PublisherTransaction::getPublisherAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        long totalSalesCount = transactions.size();

        return PublisherDashboardStats.builder()
                .totalSales(totalSalesCount)
                .totalEarnings(totalEarnings.doubleValue())
                .build();
    }

    public Page<PublisherTransaction> getTransactionHistory(String publisherEmail, Pageable pageable) {
        return transactionRepository.findByPublisherEmailOrderByCreatedAtDesc(publisherEmail, pageable);
    }
}
