package org.erp.reflectrotechodoo.config;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Provides the current authenticated user's username (email) to Spring Data JPA
 * for populating {@code createdBy} and {@code updatedBy} audit fields.
 *
 * <p>Falls back to {@code "system"} for seeder/scheduler/anonymous operations
 * so audit fields are never null.
 */
@Component("auditAwareImpl")
public class AuditAwareImpl implements AuditorAware<String> {

    private static final String SYSTEM_USER = "system";

    @Override
    public Optional<String> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return Optional.of(SYSTEM_USER);
        }

        return Optional.of(authentication.getName());
    }
}
