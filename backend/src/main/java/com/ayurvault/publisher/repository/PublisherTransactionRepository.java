package com.ayurvault.publisher.repository;

import com.ayurvault.publisher.entity.PublisherTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublisherTransactionRepository extends JpaRepository<PublisherTransaction, Long> {
    
    Page<PublisherTransaction> findByPublisherEmailOrderByCreatedAtDesc(String publisherEmail, Pageable pageable);
    
    List<PublisherTransaction> findByPublisherEmail(String publisherEmail);
}
