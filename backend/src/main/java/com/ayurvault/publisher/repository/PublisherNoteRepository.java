package com.ayurvault.publisher.repository;

import com.ayurvault.publisher.entity.PublisherNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublisherNoteRepository extends JpaRepository<PublisherNote, Long> {

    @Query("SELECT n FROM PublisherNote n WHERE LOWER(n.createdBy) = LOWER(:email)")
    List<PublisherNote> findByCreatedByIgnoreCase(String email);

    long countByCreatedBy(String createdBy);

    long countByCreatedByAndStatus(String createdBy, String status);

    @Query("SELECT n FROM PublisherNote n WHERE n.createdBy = :email AND " +
           "(LOWER(n.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(n.subject) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(n.chapter) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(n.tags) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<PublisherNote> searchMyNotes(String email, String search);
}
