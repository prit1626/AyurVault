package com.ayurvault.publisher.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "publisher_notes")
public class PublisherNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String subject;

    private String chapter;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    private Integer accessDuration; // in days

    private String fileUrl;

    @Column(nullable = false)
    private String createdBy; // email of publisher

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Builder.Default
    @Column(nullable = false)
    private String status = "ACTIVE";

    @Builder.Default
    private Boolean isFree = false;

    private String tags;

    @Builder.Default
    private Long viewsCount = 0L;

    @Builder.Default
    private Long purchaseCount = 0L;

    @Builder.Default
    private Long totalSales = 0L;

    @Builder.Default
    private BigDecimal revenue = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @OneToMany(mappedBy = "publisherNote", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<PublisherNoteFile> files;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
