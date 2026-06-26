package org.erp.reflectrotechodoo.customer.enums;

/**
 * GST registration category of the customer.
 * Determines applicable tax rules and invoice format per Indian GST law.
 */
public enum GstType {
    /** Registered under GST — 15-digit GSTIN mandatory. */
    REGISTERED,
    /** Annual turnover below the GST threshold — no GSTIN. */
    UNREGISTERED,
    /** Composition scheme taxpayer — reduced flat-rate GST. */
    COMPOSITION,
    /** Exports or SEZ supplies — zero-rated. */
    EXPORT,
    /** Consumer/individual — GST not applicable. */
    CONSUMER
}
