package org.erp.reflectrotechodoo.customer.repository;

import org.erp.reflectrotechodoo.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for {@link Customer}.
 *
 * <p>Extends {@link JpaSpecificationExecutor} to support dynamic queries
 * built by {@link org.erp.reflectrotechodoo.customer.specification.CustomerSpecification}.
 *
 * <p><strong>Soft-delete contract:</strong> All finders include {@code deleted = false}.
 * Hard deletes are not performed anywhere in the application layer.
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {

    // ── Single-record lookups ─────────────────────────────────────────────────

    Optional<Customer> findByUuidAndDeletedFalse(UUID uuid);

    Optional<Customer> findByEmailAndDeletedFalse(String email);

    Optional<Customer> findByCustomerCodeAndDeletedFalse(String customerCode);

    // ── Existence checks (for duplicate validation) ───────────────────────────

    boolean existsByEmailAndDeletedFalse(String email);

    boolean existsByGstNumberAndDeletedFalse(String gstNumber);

    boolean existsByPanNumberAndDeletedFalse(String panNumber);

    boolean existsByCustomerCodeAndDeletedFalse(String customerCode);

    /** Used on UPDATE to check uniqueness excluding the current record. */
    boolean existsByEmailAndDeletedFalseAndIdNot(String email, Long id);

    boolean existsByGstNumberAndDeletedFalseAndIdNot(String gstNumber, Long id);

    // ── Sequence for customer code generation ────────────────────────────────

    /**
     * Returns the count of customers created today — used to generate
     * the daily sequence number in customer codes (e.g. CUST-20240115-00042).
     */
    @Query("""
            SELECT COUNT(c) FROM Customer c
            WHERE FUNCTION('DATE', c.createdAt) = CURRENT_DATE
            """)
    long countCreatedToday();
}
