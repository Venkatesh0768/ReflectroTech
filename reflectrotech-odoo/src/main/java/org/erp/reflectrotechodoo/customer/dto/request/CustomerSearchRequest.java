package org.erp.reflectrotechodoo.customer.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import org.erp.reflectrotechodoo.common.enums.Status;
import org.erp.reflectrotechodoo.customer.enums.CustomerType;
import org.erp.reflectrotechodoo.customer.enums.GstType;

/**
 * Search / filter parameters for the customer list endpoint.
 *
 * <p>All fields are optional. When provided, they are ANDed together
 * by {@link org.erp.reflectrotechodoo.customer.specification.CustomerSpecification}.
 *
 * <p>{@code search} performs a partial match across: companyName, displayName,
 * customerCode, email, gstNumber.
 */
@Getter
@Setter
@Schema(description = "Customer search and filter parameters")
public class CustomerSearchRequest {

    @Schema(description = "Full-text search across name, email, code, GST", example = "Acme")
    private String search;

    @Schema(description = "Filter by customer type", example = "COMPANY")
    private CustomerType customerType;

    @Schema(description = "Filter by GST type", example = "REGISTERED")
    private GstType gstType;

    @Schema(description = "Filter by status", example = "ACTIVE")
    private Status status;

    @Schema(description = "Filter by city", example = "Chennai")
    private String city;

    @Schema(description = "Filter by state", example = "Tamil Nadu")
    private String state;

    @Schema(description = "Include soft-deleted records (admin only)", example = "false")
    private Boolean includeDeleted = Boolean.FALSE;
}
