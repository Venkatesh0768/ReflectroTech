package org.erp.reflectrotechodoo.customer.enums;

/**
 * Classifies the type of customer for business segmentation,
 * pricing tiers, and GST compliance rules in PCB manufacturing.
 */
public enum CustomerType {
    /** Individual consumer — typically B2C. */
    INDIVIDUAL,
    /** Registered private or public limited company. */
    COMPANY,
    /** Government / PSU entity (may have special procurement rules). */
    GOVERNMENT,
    /** Original Equipment Manufacturer — high-volume B2B. */
    OEM,
    /** Contract Electronics Manufacturer. */
    CEM,
    /** Re-seller or distributor of PCB assemblies. */
    DISTRIBUTOR
}
