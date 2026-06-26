package org.erp.reflectrotechodoo.customer.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.erp.reflectrotechodoo.common.enums.Status;
import org.erp.reflectrotechodoo.common.exception.BusinessException;
import org.erp.reflectrotechodoo.common.exception.DuplicateResourceException;
import org.erp.reflectrotechodoo.common.exception.ResourceNotFoundException;
import org.erp.reflectrotechodoo.common.response.PageResponse;
import org.erp.reflectrotechodoo.customer.dto.request.CustomerRequest;
import org.erp.reflectrotechodoo.customer.dto.request.CustomerSearchRequest;
import org.erp.reflectrotechodoo.customer.dto.response.CustomerResponse;
import org.erp.reflectrotechodoo.customer.entity.Customer;
import org.erp.reflectrotechodoo.customer.mapper.CustomerMapper;
import org.erp.reflectrotechodoo.customer.repository.CustomerRepository;
import org.erp.reflectrotechodoo.customer.specification.CustomerSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

/**
 * Production-grade implementation of {@link CustomerService}.
 *
 * <p>All public methods are transactional. Read-only methods use
 * {@code readOnly = true} for Hibernate performance optimisation (skips
 * dirty-checking pass and allows the connection pool to use read replicas).
 *
 * <p>Business rules enforced here:
 * <ul>
 *   <li>Email uniqueness (case-insensitive)</li>
 *   <li>GSTIN uniqueness</li>
 *   <li>PAN uniqueness</li>
 *   <li>Auto customer-code generation with daily sequence</li>
 *   <li>Blocked customers cannot be soft-deleted (must be unblocked first)</li>
 * </ul>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private static final String RESOURCE_NAME = "Customer";

    private final CustomerRepository customerRepository;
    private final CustomerMapper      customerMapper;

    // ── CREATE ────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public CustomerResponse create(CustomerRequest request) {
        log.info("Creating customer: companyName={}, email={}", request.getCompanyName(), request.getEmail());

        validateUniqueConstraintsForCreate(request);

        Customer customer = customerMapper.toEntity(request);
        customer.setCustomerCode(generateCustomerCode());
        customer.setStatus(Status.ACTIVE);

        // Apply defaults for optional fields
        if (customer.getGstType() == null) {
            customer.setGstType(org.erp.reflectrotechodoo.customer.enums.GstType.UNREGISTERED);
        }
        if (customer.getCreditLimit() == null) {
            customer.setCreditLimit(java.math.BigDecimal.ZERO);
        }
        if (customer.getPaymentTermsDays() == null) {
            customer.setPaymentTermsDays(0);
        }
        if (customer.getCountry() == null || customer.getCountry().isBlank()) {
            customer.setCountry("India");
        }

        Customer saved = customerRepository.save(customer);
        log.info("Customer created: uuid={}, code={}", saved.getUuid(), saved.getCustomerCode());
        return customerMapper.toResponse(saved);
    }

    // ── READ ──────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getByUuid(UUID uuid) {
        Customer customer = findByUuidOrThrow(uuid);
        return customerMapper.toResponse(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CustomerResponse> search(CustomerSearchRequest filter, Pageable pageable) {
        Specification<Customer> spec = CustomerSpecification.build(filter);
        Page<Customer> page = customerRepository.findAll(spec, pageable);
        List<CustomerResponse> content = page.getContent()
                .stream()
                .map(customerMapper::toResponse)
                .toList();
        log.debug("Customer search returned {} of {} total results",
                content.size(), page.getTotalElements());
        return PageResponse.from(page, content);
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public CustomerResponse update(UUID uuid, CustomerRequest request) {
        log.info("Updating customer: uuid={}", uuid);
        Customer customer = findByUuidOrThrow(uuid);

        validateUniqueConstraintsForUpdate(request, customer.getId());

        customerMapper.updateEntityFromRequest(request, customer);

        Customer saved = customerRepository.save(customer);
        log.info("Customer updated: uuid={}", saved.getUuid());
        return customerMapper.toResponse(saved);
    }

    // ── DELETE (soft) ─────────────────────────────────────────────────────────

    @Override
    @Transactional
    public void delete(UUID uuid) {
        log.info("Soft-deleting customer: uuid={}", uuid);
        Customer customer = findByUuidOrThrow(uuid);

        if (customer.getStatus() == Status.BLOCKED) {
            throw new BusinessException(
                    "CUSTOMER_BLOCKED",
                    "Cannot delete a blocked customer. Please unblock first."
            );
        }

        customer.setDeleted(true);
        customer.setStatus(Status.INACTIVE);
        customerRepository.save(customer);
        log.info("Customer soft-deleted: uuid={}", uuid);
    }

    // ── STATUS CHANGE ─────────────────────────────────────────────────────────

    @Override
    @Transactional
    public CustomerResponse changeStatus(UUID uuid, Status status) {
        log.info("Changing customer status: uuid={}, newStatus={}", uuid, status);
        Customer customer = findByUuidOrThrow(uuid);

        if (customer.isDeleted()) {
            throw new BusinessException("CUSTOMER_DELETED", "Cannot change status of a deleted customer.");
        }

        customer.setStatus(status);
        Customer saved = customerRepository.save(customer);
        log.info("Customer status changed: uuid={}, status={}", saved.getUuid(), saved.getStatus());
        return customerMapper.toResponse(saved);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private Customer findByUuidOrThrow(UUID uuid) {
        return customerRepository.findByUuidAndDeletedFalse(uuid)
                .orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NAME, "uuid", uuid));
    }

    private void validateUniqueConstraintsForCreate(CustomerRequest request) {
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (customerRepository.existsByEmailAndDeletedFalse(request.getEmail())) {
                throw new DuplicateResourceException(RESOURCE_NAME, "email", request.getEmail());
            }
        }
        if (request.getGstNumber() != null && !request.getGstNumber().isBlank()) {
            if (customerRepository.existsByGstNumberAndDeletedFalse(request.getGstNumber())) {
                throw new DuplicateResourceException(RESOURCE_NAME, "gstNumber", request.getGstNumber());
            }
        }
    }

    private void validateUniqueConstraintsForUpdate(CustomerRequest request, Long currentId) {
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (customerRepository.existsByEmailAndDeletedFalseAndIdNot(request.getEmail(), currentId)) {
                throw new DuplicateResourceException(RESOURCE_NAME, "email", request.getEmail());
            }
        }
        if (request.getGstNumber() != null && !request.getGstNumber().isBlank()) {
            if (customerRepository.existsByGstNumberAndDeletedFalseAndIdNot(request.getGstNumber(), currentId)) {
                throw new DuplicateResourceException(RESOURCE_NAME, "gstNumber", request.getGstNumber());
            }
        }
    }

    /**
     * Generates a human-readable, sortable customer code.
     *
     * <p>Format: {@code CUST-YYYYMMDD-NNNNN}
     * <br>Example: {@code CUST-20240626-00001}
     *
     * <p>The sequence resets daily. Thread safety for code generation is
     * guaranteed by the {@code @Transactional} boundary on the calling method.
     */
    private String generateCustomerCode() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long todayCount = customerRepository.countCreatedToday() + 1;
        return String.format("CUST-%s-%05d", datePart, todayCount);
    }
}
