package org.erp.reflectrotechodoo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Activates Spring Data JPA auditing.
 *
 * <p>{@code auditorAwareRef} wires to {@link AuditAwareImpl} which resolves
 * the current authenticated user for {@code @CreatedBy} / {@code @LastModifiedBy}.
 *
 * <p>Kept in a dedicated config class (not on the main application class)
 * to maintain single-responsibility and allow clean test slicing with
 * {@code @DataJpaTest} overrides.
 */
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditAwareImpl")
public class JpaAuditingConfig {
    // intentionally empty — annotation does the work
}
