package com.ayurvault.publisher.service;

import com.ayurvault.publisher.dto.PublisherDashboardStats;
import com.ayurvault.publisher.dto.UpdateNoteRequest;
import com.ayurvault.publisher.entity.PublisherNote;
import com.ayurvault.publisher.entity.PublisherTransaction;
import com.ayurvault.publisher.repository.PublisherNoteRepository;
import com.ayurvault.publisher.repository.PublisherTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PublisherNoteService {

    private final PublisherNoteRepository publisherNoteRepository;
    private final PublisherTransactionRepository publisherTransactionRepository;

    @Transactional
    public void incrementViews(Long noteId) {
        PublisherNote note = publisherNoteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        note.setViewsCount(note.getViewsCount() + 1);
        publisherNoteRepository.save(note);
    }

    @Transactional
    public void recordPurchase(Long noteId, String studentEmail) {
        PublisherNote note = publisherNoteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        
        // Update Note Stats
        note.setPurchaseCount(note.getPurchaseCount() + 1);
        note.setTotalSales(note.getTotalSales() + 1);
        note.setTotalRevenue(note.getTotalRevenue().add(note.getPrice()));
        publisherNoteRepository.save(note);

        // Record Transaction (90/10 split mock)
        BigDecimal amount = note.getPrice();
        BigDecimal commission = amount.multiply(new BigDecimal("0.10"));
        BigDecimal publisherAmt = amount.subtract(commission);

        PublisherTransaction transaction = PublisherTransaction.builder()
                .publisherEmail(note.getCreatedBy())
                .noteId(noteId)
                .studentEmail(studentEmail)
                .amount(amount)
                .platformCommission(commission)
                .publisherAmount(publisherAmt)
                .status("COMPLETED")
                .paymentId("MOCK_" + System.currentTimeMillis())
                .build();
        
        publisherTransactionRepository.save(transaction);
    }

    public PublisherDashboardStats getDashboardStats(String publisherEmail) {
        long totalUploads = publisherNoteRepository.countByCreatedBy(publisherEmail);
        long pendingNotes = publisherNoteRepository.countByCreatedByAndStatus(publisherEmail, "PENDING");

        return PublisherDashboardStats.builder()
                .totalUploads(totalUploads)
                .totalSales(0L)       // Phase 2
                .totalEarnings(0.0)   // Phase 2
                .pendingNotes(pendingNotes)
                .build();
    }

    public List<PublisherNote> getMyNotes(String publisherEmail, String search) {
        if (search != null && !search.trim().isEmpty()) {
            return publisherNoteRepository.searchMyNotes(publisherEmail, search);
        }
        return publisherNoteRepository.findByCreatedByIgnoreCase(publisherEmail);
    }

    @Transactional
    public void deleteNote(Long noteId, String publisherEmail) {
        PublisherNote note = publisherNoteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!note.getCreatedBy().equals(publisherEmail)) {
            throw new RuntimeException("Unauthorized: You do not own this note");
        }

        publisherNoteRepository.delete(note);
    }

    @Transactional
    public PublisherNote updateNote(Long noteId, String publisherEmail, UpdateNoteRequest request) {
        PublisherNote note = publisherNoteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!note.getCreatedBy().equals(publisherEmail)) {
            throw new RuntimeException("Unauthorized: You do not own this note");
        }

        // Only update allowed fields
        if (request.getTitle() != null) note.setTitle(request.getTitle());
        if (request.getDescription() != null) note.setDescription(request.getDescription());
        if (request.getTags() != null) note.setTags(request.getTags());
        
        if (Boolean.TRUE.equals(request.getIsFree())) {
            note.setIsFree(true);
            note.setPrice(BigDecimal.ZERO);
        } else {
            note.setIsFree(false);
            if (request.getPrice() != null) note.setPrice(request.getPrice());
        }
        
        if (request.getAccessDuration() != null) {
            int durationInDays = calculateDays(request.getAccessDuration(), request.getDurationUnit());
            note.setAccessDuration(durationInDays);
        }

        return publisherNoteRepository.save(note);
    }

    private int calculateDays(Integer duration, String unit) {
        if (duration == null) return 0;
        if (unit == null) return duration;
        
        switch (unit.toLowerCase()) {
            case "month": return duration * 30;
            case "year": return duration * 365;
            default: return duration; // default as day
        }
    }
}
