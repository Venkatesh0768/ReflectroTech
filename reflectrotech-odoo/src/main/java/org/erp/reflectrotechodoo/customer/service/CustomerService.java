package org.erp.reflectrotechodoo.customer.service;

import org.erp.reflectrotechodoo.common.enums.Status;
import org.erp.reflectrotechodoo.common.response.PageResponse;
import org.erp.reflectrotechodoo.customer.dto.request.CustomerRequest;
import org.erp.reflectrotechodoo.customer.dto.request.CustomerSearchRequest;
import org.erp.reflectrotechodoo.customer.dto.response.CustomerResponse;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Customer service contract.
 *
 * <p>All methods operate on public-facing {@link UUID}s — never on internal
 * database IDs, protecting against enumeration attacks at the API level.
 */
public interface CustomerService {

    /**
     * Creates a new customer. Validates uniqueness of email and GST number.
     * Auto-generates a human-readable {@code customerCode}.
     *
     * @param request validated customer data
     * @return persisted customer as response DTO
     */
    CustomerResponse create(CustomerRequest request);

    /**
     * Retrieves a non-deleted customer by its public UUID.
     *
     * @param uuid customer UUID
     * @return customer response DTO
     * @throws org.erp.reflectrotechodoo.common.exception.ResourceNotFoundException if not found
     */
    CustomerResponse getByUuid(UUID uuid);

    /**
     * Returns a paginated, filtered, and sorted list of customers.
     *
     * @param filter   search and filter criteria
     * @param pageable pagination and sort parameters (from request params)
     * @return paginated response
     */
    PageResponse<CustomerResponse> search(CustomerSearchRequest filter, Pageable pageable);

    /**
     * Updates an existing customer using PATCH semantics —
     * only non-null request fields overwrite the existing record.
     *
     * @param uuid    customer UUID
     * @param request fields to update
     * @return updated customer response DTO
     */
    CustomerResponse update(UUID uuid, CustomerRequest request);

    /**
     * Soft-deletes a customer by setting {@code deleted = true}.
     * The record remains in the database for audit and relational integrity.
     *
     * @param uuid customer UUID
     */
    void delete(UUID uuid);

    /**
     * Changes the status of a customer (ACTIVE → INACTIVE, BLOCKED, etc.).
     *
     * @param uuid   customer UUID
     * @param status new status
     * @return updated customer response DTO
     */
    CustomerResponse changeStatus(UUID uuid, Status status);
}
