package org.erp.reflectrotechodoo.customer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.erp.reflectrotechodoo.common.enums.Status;
import org.erp.reflectrotechodoo.common.response.ApiResponse;
import org.erp.reflectrotechodoo.common.response.PageResponse;
import org.erp.reflectrotechodoo.customer.dto.request.CustomerRequest;
import org.erp.reflectrotechodoo.customer.dto.request.CustomerSearchRequest;
import org.erp.reflectrotechodoo.customer.dto.response.CustomerResponse;
import org.erp.reflectrotechodoo.customer.service.CustomerService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST controller for Customer resource management.
 *
 * <p>Controller responsibilities are limited to:
 * <ol>
 *   <li>Parsing and validating HTTP request (via {@link Valid})</li>
 *   <li>Delegating to {@link CustomerService}</li>
 *   <li>Wrapping the result in a standard {@link ApiResponse}</li>
 *   <li>Returning the correct HTTP status code</li>
 * </ol>
 *
 * <p>No business logic lives here.
 *
 * <p>Base URL: {@code /api/v1/customers}
 */
@Slf4j
@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
@Tag(name = "Customer Management", description = "APIs for managing customer master data in the ERP")
@SecurityRequirement(name = "bearerAuth")
public class CustomerController {

    private final CustomerService customerService;

    // ────────────────────────────────────────────────────────────────────────
    // POST /customers
    // ────────────────────────────────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES', 'USER')")
    @Operation(
            summary     = "Create a new customer",
            description = "Creates a customer with an auto-generated customer code. "
                    + "Email and GSTIN must be unique across non-deleted records."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Customer created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation failed"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Duplicate email or GST number")
    })
    public ResponseEntity<ApiResponse<CustomerResponse>> create(
            @Valid @RequestBody CustomerRequest request) {

        log.info("POST /customers — creating customer: {}", request.getCompanyName());
        CustomerResponse response = customerService.create(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Customer created successfully", response));
    }

    // ────────────────────────────────────────────────────────────────────────
    // GET /customers/{uuid}
    // ────────────────────────────────────────────────────────────────────────

    @GetMapping("/{uuid}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES', 'ACCOUNTS', 'USER')")
    @Operation(summary = "Get customer by UUID", description = "Returns a single non-deleted customer")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Customer found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer not found")
    })
    public ResponseEntity<ApiResponse<CustomerResponse>> getByUuid(
            @Parameter(description = "Customer UUID", required = true)
            @PathVariable UUID uuid) {

        CustomerResponse response = customerService.getByUuid(uuid);
        return ResponseEntity.ok(ApiResponse.success("Customer retrieved successfully", response));
    }

    // ────────────────────────────────────────────────────────────────────────
    // GET /customers  (search, filter, paginate, sort)
    // ────────────────────────────────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES', 'ACCOUNTS', 'USER')")
    @Operation(
            summary     = "Search and list customers",
            description = "Returns a paginated list of customers. Supports search, filtering by type/status/city/state, "
                    + "sorting, and pagination. All filter parameters are optional."
    )
    public ResponseEntity<ApiResponse<PageResponse<CustomerResponse>>> search(
            @Parameter(description = "Full-text search across name, email, code, GST")
            @RequestParam(required = false) String search,

            @Parameter(description = "Filter by customer type: INDIVIDUAL, COMPANY, GOVERNMENT, OEM, CEM, DISTRIBUTOR")
            @RequestParam(required = false) org.erp.reflectrotechodoo.customer.enums.CustomerType customerType,

            @Parameter(description = "Filter by GST type: REGISTERED, UNREGISTERED, COMPOSITION, EXPORT, CONSUMER")
            @RequestParam(required = false) org.erp.reflectrotechodoo.customer.enums.GstType gstType,

            @Parameter(description = "Filter by status: ACTIVE, INACTIVE, BLOCKED")
            @RequestParam(required = false) Status status,

            @Parameter(description = "Filter by city")
            @RequestParam(required = false) String city,

            @Parameter(description = "Filter by state")
            @RequestParam(required = false) String state,

            @Parameter(description = "Include soft-deleted records (requires ADMIN role)")
            @RequestParam(required = false, defaultValue = "false") boolean includeDeleted,

            @Parameter(description = "Page number (0-based)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size (1-100)", example = "20")
            @RequestParam(defaultValue = "20") int size,

            @Parameter(description = "Sort field", example = "companyName")
            @RequestParam(defaultValue = "createdAt") String sortBy,

            @Parameter(description = "Sort direction", example = "desc")
            @RequestParam(defaultValue = "desc") String sortDir) {

        // Clamp page size to prevent abuse
        int clampedSize = Math.min(size, 100);

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, clampedSize, sort);

        CustomerSearchRequest filter = new CustomerSearchRequest();
        filter.setSearch(search);
        filter.setCustomerType(customerType);
        filter.setGstType(gstType);
        filter.setStatus(status);
        filter.setCity(city);
        filter.setState(state);
        filter.setIncludeDeleted(includeDeleted);

        PageResponse<CustomerResponse> result = customerService.search(filter, pageable);
        return ResponseEntity.ok(ApiResponse.success("Customers retrieved successfully", result));
    }

    // ────────────────────────────────────────────────────────────────────────
    // PUT /customers/{uuid}
    // ────────────────────────────────────────────────────────────────────────

    @PutMapping("/{uuid}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES', 'USER')")
    @Operation(
            summary     = "Update a customer",
            description = "Updates customer data using PATCH semantics: only non-null request fields are applied."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Customer updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation failed"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Duplicate email or GST")
    })
    public ResponseEntity<ApiResponse<CustomerResponse>> update(
            @PathVariable UUID uuid,
            @Valid @RequestBody CustomerRequest request) {

        log.info("PUT /customers/{} — updating customer", uuid);
        CustomerResponse response = customerService.update(uuid, request);
        return ResponseEntity.ok(ApiResponse.success("Customer updated successfully", response));
    }

    // ────────────────────────────────────────────────────────────────────────
    // DELETE /customers/{uuid}
    // ────────────────────────────────────────────────────────────────────────

    @DeleteMapping("/{uuid}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'USER')")
    @Operation(
            summary     = "Soft-delete a customer",
            description = "Marks the customer as deleted. The record is not physically removed. "
                    + "Blocked customers cannot be deleted without first unblocking them."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Customer deleted"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Business rule violation")
    })
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID uuid) {
        log.info("DELETE /customers/{} — soft-deleting customer", uuid);
        customerService.delete(uuid);
        return ResponseEntity.ok(ApiResponse.success("Customer deleted successfully"));
    }

    // ────────────────────────────────────────────────────────────────────────
    // PATCH /customers/{uuid}/status
    // ────────────────────────────────────────────────────────────────────────

    @PatchMapping("/{uuid}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'USER')")
    @Operation(
            summary     = "Change customer status",
            description = "Activates, deactivates, or blocks a customer. "
                    + "Deleted customers cannot have their status changed."
    )
    public ResponseEntity<ApiResponse<CustomerResponse>> changeStatus(
            @PathVariable UUID uuid,
            @Parameter(description = "New status value", required = true)
            @RequestParam Status status) {

        log.info("PATCH /customers/{}/status — changing to {}", uuid, status);
        CustomerResponse response = customerService.changeStatus(uuid, status);
        return ResponseEntity.ok(ApiResponse.success(
                "Customer status changed to " + status, response));
    }
}
