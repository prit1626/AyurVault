package com.ayurvault.publisher.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateNoteRequest {
    private String title;
    private String description;
    private String subject;
    private String chapter;
    private String tags;
    private BigDecimal price;
    private Integer accessDuration;
    private String durationUnit; // day, month, year
    private Boolean isFree;
}
