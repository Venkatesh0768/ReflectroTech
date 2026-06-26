package org.erp.reflectrotechodoo.customer.specification;

import jakarta.persistence.criteria.Predicate;
import org.erp.reflectrotechodoo.customer.dto.request.CustomerSearchRequest;
import org.erp.reflectrotechodoo.customer.entity.Customer;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * JPA Specification factory for dynamic Customer queries.
 *
 * <p>All predicates are AND-ed together. Null / blank fields are skipped,
 * making each filter optional.
 *
 * <p>The {@code search} field performs a case-insensitive LIKE across:
 * companyName, displayName, customerCode, email, gstNumber.
 *
 * <p>Usage:
 * <pre>{@code
 *   Specification<Customer> spec = CustomerSpecification.build(searchRequest);
 *   Page<Customer> page = customerRepository.findAll(spec, pageable);
 * }</pre>
 */
public final class CustomerSpecification {

    private CustomerSpecification() {
        // utility class — no instantiation
    }

    public static Specification<Customer> build(CustomerSearchRequest filter) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // ── Soft-delete guard ─────────────────────────────────────────────
            if (filter.getIncludeDeleted() == null || !filter.getIncludeDeleted()) {
                predicates.add(cb.isFalse(root.get("deleted")));
            }

            // ── Full-text search ──────────────────────────────────────────────
            if (hasText(filter.getSearch())) {
                String pattern = likePattern(filter.getSearch());
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("companyName")),   pattern),
                        cb.like(cb.lower(root.get("displayName")),   pattern),
                        cb.like(cb.lower(root.get("customerCode")),  pattern),
                        cb.like(cb.lower(root.get("email")),         pattern),
                        cb.like(cb.lower(root.get("gstNumber")),     pattern),
                        cb.like(cb.lower(root.get("phone")),         pattern)
                ));
            }

            // ── Enum filters ──────────────────────────────────────────────────
            if (filter.getCustomerType() != null) {
                predicates.add(cb.equal(root.get("customerType"), filter.getCustomerType()));
            }

            if (filter.getGstType() != null) {
                predicates.add(cb.equal(root.get("gstType"), filter.getGstType()));
            }

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }

            // ── Location filters ──────────────────────────────────────────────
            if (hasText(filter.getCity())) {
                predicates.add(cb.like(
                        cb.lower(root.get("city")),
                        likePattern(filter.getCity())
                ));
            }

            if (hasText(filter.getState())) {
                predicates.add(cb.like(
                        cb.lower(root.get("state")),
                        likePattern(filter.getState())
                ));
            }

            // ── Distinct to prevent duplicates from future JOINs ─────────────
            if (query != null) {
                query.distinct(true);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private static String likePattern(String value) {
        return "%" + value.toLowerCase().trim() + "%";
    }
}
