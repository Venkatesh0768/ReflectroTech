package org.erp.reflectrotechodoo.customer.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.erp.reflectrotechodoo.customer.enums.CustomerType;
import org.erp.reflectrotechodoo.customer.enums.GstType;

import java.math.BigDecimal;

/**
 * Request DTO for creating or updating a Customer.
 *
 * <p>All validation annotations are Bean Validation (Jakarta) — enforced at
 * the controller boundary before the request reaches the service layer.
 *
 * <p>Email uniqueness and GST format validation are performed in the service
 * layer since they require a database hit and are business rules, not format
 * rules that belong here.
 */
@Getter
@Setter
@Schema(description = "Payload for creating or updating a customer")
public class CustomerRequest {

    // ── Identity ──────────────────────────────────────────────────────────────

    @NotBlank(message = "Company name is required")
    @Size(max = 200, message = "Company name must not exceed 200 characters")
    @Schema(description = "Legal company or individual name", example = "Acme Circuits Pvt. Ltd.")
    private String companyName;

    @Size(max = 200, message = "Display name must not exceed 200 characters")
    @Schema(description = "Trading/display name used on invoices", example = "Acme Circuits")
    private String displayName;

    @NotNull(message = "Customer type is required")
    @Schema(description = "Customer classification", example = "COMPANY")
    private CustomerType customerType;

    // ── Contact ───────────────────────────────────────────────────────────────

    @Email(message = "Email must be a valid email address")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    @Schema(description = "Primary contact email", example = "procurement@acme.com")
    private String email;

    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Phone number must be 10-15 digits")
    @Schema(description = "Primary phone number", example = "+919876543210")
    private String phone;

    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Alternate phone must be 10-15 digits")
    @Schema(description = "Alternate phone number")
    private String alternatePhone;

    @Size(max = 200, message = "Website URL must not exceed 200 characters")
    @Schema(description = "Company website", example = "https://www.acmecircuits.com")
    private String website;

    // ── Address ───────────────────────────────────────────────────────────────

    @Size(max = 255, message = "Address line 1 must not exceed 255 characters")
    @Schema(description = "Street address line 1")
    private String addressLine1;

    @Size(max = 255, message = "Address line 2 must not exceed 255 characters")
    @Schema(description = "Street address line 2 (area, landmark)")
    private String addressLine2;

    @Size(max = 100, message = "City must not exceed 100 characters")
    @Schema(description = "City", example = "Chennai")
    private String city;

    @Size(max = 100, message = "State must not exceed 100 characters")
    @Schema(description = "State or province", example = "Tamil Nadu")
    private String state;

    @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Pincode must be a 6-digit Indian postal code")
    @Schema(description = "Indian PIN code", example = "600001")
    private String pincode;

    @Size(max = 100)
    @Schema(description = "Country", example = "India")
    private String country;

    // ── GST / Tax ─────────────────────────────────────────────────────────────

    /**
     * GSTIN validation regex per Indian GST rules:
     * 2-digit state + 10-char PAN + 1-digit entity + Z + 1 check digit.
     */
    @Pattern(
            regexp = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
            message = "GST number must be a valid 15-character GSTIN"
    )
    @Schema(description = "15-digit GSTIN", example = "33AAAPL1234F1Z5")
    private String gstNumber;

    @Schema(description = "GST registration category", example = "REGISTERED")
    private GstType gstType;

    @Pattern(
            regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
            message = "PAN must be a valid 10-character alphanumeric PAN number"
    )
    @Schema(description = "10-character PAN number", example = "AAAPL1234F")
    private String panNumber;

    // ── Commercial ────────────────────────────────────────────────────────────

    @DecimalMin(value = "0.0", message = "Credit limit cannot be negative")
    @Digits(integer = 13, fraction = 2, message = "Credit limit must have at most 2 decimal places")
    @Schema(description = "Credit limit in INR (0 = COD)", example = "500000.00")
    private BigDecimal creditLimit;

    @Min(value = 0, message = "Payment terms cannot be negative")
    @Max(value = 365, message = "Payment terms cannot exceed 365 days")
    @Schema(description = "Payment due date in days after invoice", example = "30")
    private Integer paymentTermsDays;

    // ── CRM ───────────────────────────────────────────────────────────────────

    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    @Schema(description = "Internal notes for the sales team")
    private String notes;

    @Size(max = 150, message = "Contact person name must not exceed 150 characters")
    @Schema(description = "Primary contact person at the customer", example = "Ramesh Kumar")
    private String contactPerson;

    @Size(max = 100, message = "Designation must not exceed 100 characters")
    @Schema(description = "Designation of contact person", example = "Purchase Manager")
    private String contactDesignation;
}
