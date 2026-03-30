package com.ayurvault.publisher.controller;

import com.ayurvault.publisher.dto.PublisherDashboardStats;
import com.ayurvault.publisher.dto.UpdateNoteRequest;
import com.ayurvault.publisher.entity.PublisherNote;
import com.ayurvault.publisher.service.PublisherNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publisher")
@RequiredArgsConstructor
public class PublisherNoteController {

    private final PublisherNoteService publisherNoteService;

    @GetMapping("/dashboard")
    public ResponseEntity<PublisherDashboardStats> getDashboardStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        String publisherEmail = userDetails.getUsername();
        return ResponseEntity.ok(publisherNoteService.getDashboardStats(publisherEmail));
    }

    @GetMapping("/my-notes")
    public ResponseEntity<List<PublisherNote>> getMyNotes(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String search) {
        String publisherEmail = userDetails.getUsername();
        return ResponseEntity.ok(publisherNoteService.getMyNotes(publisherEmail, search));
    }

    @DeleteMapping("/note/{id}")
    public ResponseEntity<Void> deleteNote(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String publisherEmail = userDetails.getUsername();
        publisherNoteService.deleteNote(id, publisherEmail);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/note/{id}")
    public ResponseEntity<PublisherNote> updateNote(
            @PathVariable Long id,
            @RequestBody UpdateNoteRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String publisherEmail = userDetails.getUsername();
        return ResponseEntity.ok(publisherNoteService.updateNote(id, publisherEmail, request));
    }
}
