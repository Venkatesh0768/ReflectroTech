package org.erp.reflectrotechodoo.customer.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import org.erp.reflectrotechodoo.common.enums.Status;
import org.erp.reflectrotechodoo.customer.enums.CustomerType;
import org.erp.reflectrotechodoo.customer.enums.GstType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for Customer resources.
 *
 * <p>The internal database {@code id} (Long) is NEVER exposed to the API.
 * Consumers always use the {@code uuid} to reference a customer.
 *
 * <p>{@code @JsonInclude(NON_NULL)} suppresses null optional fields
 * (e.g. website, notes) from the JSON response to reduce payload size.
 */
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Customer resource representation")
public class CustomerResponse {

    @Schema(description = "Public customer UUID", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID uuid;

    @Schema(description = "Auto-generated customer code", example = "CUST-20240115-00001")
    private String customerCode;

    @Schema(description = "Legal company name", example = "Acme Circuits Pvt. Ltd.")
    private String companyName;

    @Schema(description = "Display / trading name", example = "Acme Circuits")
    private String displayName;

    @Schema(description = "Customer type classification")
    private CustomerType customerType;

    // ── Contact ───────────────────────────────────────────────────────────────

    @Schema(description = "Primary email")
    private String email;

    @Schema(description = "Primary phone")
    private String phone;

    @Schema(description = "Alternate phone")
    private String alternatePhone;

    @Schema(description = "Company website")
    private String website;

    // ── Address ───────────────────────────────────────────────────────────────

    @Schema(description = "Address line 1")
    private String addressLine1;

    @Schema(description = "Address line 2")
    private String addressLine2;

    @Schema(description = "City")
    private String city;

    @Schema(description = "State")
    private String state;

    @Schema(description = "PIN code")
    private String pincode;

    @Schema(description = "Country")
    private String country;

    // ── GST / Tax ─────────────────────────────────────────────────────────────

    @Schema(description = "GSTIN number")
    private String gstNumber;

    @Schema(description = "GST registration category")
    private GstType gstType;

    @Schema(description = "PAN number")
    private String panNumber;

    // ── Commercial ────────────────────────────────────────────────────────────

    @Schema(description = "Approved credit limit in INR")
    private BigDecimal creditLimit;

    @Schema(description = "Payment terms in days")
    private Integer paymentTermsDays;

    // ── CRM ───────────────────────────────────────────────────────────────────

    @Schema(description = "Internal notes")
    private String notes;

    @Schema(description = "Primary contact person")
    private String contactPerson;

    @Schema(description = "Contact person designation")
    private String contactDesignation;

    // ── System ───────────────────────────────────────────────────────────────

    @Schema(description = "Current status")
    private Status status;

    @Schema(description = "Whether the record is soft-deleted")
    private boolean deleted;

    @Schema(description = "Optimistic lock version")
    private Long version;

    @Schema(description = "Record creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Last update timestamp")
    private LocalDateTime updatedAt;

    @Schema(description = "Created by (username)")
    private String createdBy;

    @Schema(description = "Last modified by (username)")
    private String updatedBy;
}
