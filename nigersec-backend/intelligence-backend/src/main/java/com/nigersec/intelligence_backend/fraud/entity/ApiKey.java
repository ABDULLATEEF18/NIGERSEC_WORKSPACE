package com.nigersec.intelligence_backend.fraud.entity;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "api_keys")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ApiKey {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String keyHash;             // SHA-256 of the raw API key

    @Column(nullable = false)
    private UUID institutionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApiKeyTier tier;            // DEVELOPER | BUSINESS | ENTERPRISE

    private long monthlyCallLimit;

    @Builder.Default
    private long callsThisMonth = 0;

    @Builder.Default
    private boolean active = true;

    private Instant expiresAt;

    @CreationTimestamp
    private Instant createdAt;
}
