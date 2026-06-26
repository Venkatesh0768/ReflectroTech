package org.erp.reflectrotechodoo.common.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.erp.reflectrotechodoo.common.enums.Status;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Base entity inherited by every aggregate root in the ERP system.
 *
 * <p>Design decisions:
 * <ul>
 *   <li>{@code id}  — surrogate Long PK for fast JOIN performance (never exposed to API).</li>
 *   <li>{@code uuid} — public identifier exposed via REST API (prevents enumeration attacks).</li>
 *   <li>{@code version} — optimistic locking via {@link Version}.</li>
 *   <li>{@code deleted} — soft delete flag; repositories filter {@code deleted = false} by default.</li>
 *   <li>{@code createdBy / updatedBy} — populated by {@link AuditingEntityListener}
 *       via {@link org.erp.reflectrotechodoo.config.AuditAwareImpl}.</li>
 * </ul>
 *
 * <p>Uses {@code @SuperBuilder} instead of {@code @Builder} so that subclass
 * entities can inherit builder fields correctly (standard @Builder does not
 * propagate to child class builders).
 */
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false, nullable = false)
    private Long id;

    @UuidGenerator
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "uuid", updatable = false, nullable = false, unique = true, length = 36)
    private UUID uuid;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.ACTIVE;

    @Column(nullable = false)
    private boolean deleted = false;

    @Version
    @Column(nullable = false)
    private Long version = 0L;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @CreatedBy
    @Column(nullable = false, updatable = false, length = 100)
    private String createdBy;

    @LastModifiedBy
    @Column(nullable = false, length = 100)
    private String updatedBy;
}
