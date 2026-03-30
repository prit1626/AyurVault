package com.ayurvault.publisher.controller;

import com.ayurvault.publisher.dto.UploadNoteRequest;
import com.ayurvault.publisher.entity.PublisherNote;
import com.ayurvault.publisher.service.PublisherUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/publisher")
@RequiredArgsConstructor
public class PublisherUploadController {

    private final PublisherUploadService publisherUploadService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('PUBLISHER')")
    public ResponseEntity<?> uploadNote(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("subject") String subject,
            @RequestParam("chapter") String chapter,
            @RequestParam("price") BigDecimal price,
            @RequestParam("accessDuration") Integer accessDuration,
            @RequestParam("durationUnit") String durationUnit,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam("files") List<MultipartFile> files,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            UploadNoteRequest request = UploadNoteRequest.builder()
                    .title(title)
                    .description(description)
                    .subject(subject)
                    .chapter(chapter)
                    .price(price)
                    .accessDuration(accessDuration)
                    .durationUnit(durationUnit)
                    .tags(tags)
                    .build();

            PublisherNote note = publisherUploadService.uploadNote(request, files, userDetails.getUsername());
            return ResponseEntity.ok(note);
            
        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        }
    }
}
