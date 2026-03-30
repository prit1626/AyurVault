package com.ayurvault.publisher.service;

import com.ayurvault.publisher.dto.UploadNoteRequest;
import com.ayurvault.publisher.entity.PublisherNote;
import com.ayurvault.publisher.entity.PublisherNoteFile;
import com.ayurvault.publisher.repository.PublisherNoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PublisherUploadService {

    private final PublisherNoteRepository publisherNoteRepository;
    private final String uploadDir = "uploads/notes/";

    @Transactional
    public PublisherNote uploadNote(UploadNoteRequest request, List<MultipartFile> files, String publisherEmail) throws IOException {
        // 1. Create directory if not exists
        Path root = Paths.get(uploadDir);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        // 2. Conversion logic (handling days/months/years)
        int durationInDays = calculateDays(request.getAccessDuration(), request.getDurationUnit());

        // 3. Create Note Entity
        PublisherNote note = PublisherNote.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .subject(request.getSubject())
                .chapter(request.getChapter())
                .tags(request.getTags())
                .price(Boolean.TRUE.equals(request.getIsFree()) ? java.math.BigDecimal.ZERO : request.getPrice())
                .isFree(Boolean.TRUE.equals(request.getIsFree()))
                .accessDuration(durationInDays)
                .createdBy(publisherEmail)
                .status("ACTIVE")
                .files(new ArrayList<>())
                .build();

        // 4. Save files and create File Entities
        for (MultipartFile file : files) {
            String originalFileName = file.getOriginalFilename();
            String uniqueFileName = UUID.randomUUID() + "_" + originalFileName;
            Path filePath = root.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath);

            PublisherNoteFile noteFile = PublisherNoteFile.builder()
                    .fileName(originalFileName)
                    .fileUrl(filePath.toString())
                    .fileType(file.getContentType())
                    .publisherNote(note)
                    .build();
            
            note.getFiles().add(noteFile);
        }

        return publisherNoteRepository.save(note);
    }

    private int calculateDays(Integer duration, String unit) {
        if (duration == null || unit == null) return 0;
        switch (unit.toLowerCase()) {
            case "month": return duration * 30;
            case "year": return duration * 365;
            default: return duration; // default as day
        }
    }
}
