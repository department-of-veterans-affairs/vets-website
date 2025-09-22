/**
 * ⚠️  WARNING: DATABASE SIZE IMPACT ⚠️
 *
 * BEFORE ADDING NEW EVENTS TO THIS REGISTRY:
 *
 * 1. Each new event type creates a new record for EVERY user who triggers it
 * 2. With millions of VA users, each event can result in millions of database records
 * 3. Consider the long-term storage implications before adding events
 * 4. Discuss with the backend team and database administrators
 * 5. Only add events that provide significant analytical value and use other
 *    methods to track the same information (e.g., Google Analytics)
 *
 * EVENT NAMING CONVENTION:
 * - Use pattern: feature_action_accessed (e.g., "mhv_landing_page_accessed")
 * - Maximum 50 characters per event name
 * - Be descriptive but concise
 * - Use lowercase with underscores
 *
 * ⚠️  THINK TWICE BEFORE ADDING NEW EVENTS ⚠️
 */

/**
 * Centralized registry of all unique user metric event identifiers.
 * This forces developers to come to one place to add new events and
 * see the database size warning above.
 */
export const EVENT_REGISTRY = Object.freeze({
  // Secure Messaging Events
  SECURE_MESSAGING_MESSAGE_SENT: 'mhv_sm_message_sent',
  SECURE_MESSAGING_INBOX_ACCESSED: 'mhv_sm_inbox_accessed',

  // Prescriptions Events
  PRESCRIPTIONS_ACCESSED: 'mhv_rx_accessed',
  PRESCRIPTIONS_REFILL_REQUESTED: 'mhv_rx_refill_requested',

  // Medical Records Events
  MEDICAL_RECORDS_ACCESSED: 'mhv_mr_accessed',
  MEDICAL_RECORDS_LABS_ACCESSED: 'mhv_mr_labs_accessed',
  MEDICAL_RECORDS_VITALS_ACCESSED: 'mhv_mr_vitals_accessed',
  MEDICAL_RECORDS_VACCINES_ACCESSED: 'mhv_mr_vaccines_accessed',
  MEDICAL_RECORDS_ALLERGIES_ACCESSED: 'mhv_mr_allergies_accessed',
  MEDICAL_RECORDS_CONDITIONS_ACCESSED: 'mhv_mr_conditions_accessed',
  MEDICAL_RECORDS_NOTES_ACCESSED: 'mhv_mr_notes_accessed',

  // Appointments Events
  APPOINTMENTS_ACCESSED: 'mhv_appointments_accessed',
});

/**
 * Site IDs that should have Oracle Health-specific event logging.
 * Only facilities listed here will trigger additional site-specific events.
 */
export const ORACLE_HEALTH_TRACKED_SITES = Object.freeze({
  // Site IDs that should trigger Oracle Health specific logging
  COLUMBUS_OH: '757',
  // Add more sites here as needed
  // EXAMPLE_SITE: '123',
});

/**
 * Events that should have Oracle Health site-specific logging.
 * When any of these events are logged, if the user is registered at an Oracle Health site,
 * we'll also log a site-specific version of the event.
 */
export const ORACLE_HEALTH_TRACKED_EVENTS = Object.freeze([
  EVENT_REGISTRY.SECURE_MESSAGING_MESSAGE_SENT,
  EVENT_REGISTRY.PRESCRIPTIONS_REFILL_REQUESTED,
  EVENT_REGISTRY.APPOINTMENTS_ACCESSED,
  EVENT_REGISTRY.MEDICAL_RECORDS_ALLERGIES_ACCESSED,
  EVENT_REGISTRY.MEDICAL_RECORDS_VACCINES_ACCESSED,
  EVENT_REGISTRY.MEDICAL_RECORDS_LABS_ACCESSED,
  EVENT_REGISTRY.MEDICAL_RECORDS_NOTES_ACCESSED,
  EVENT_REGISTRY.MEDICAL_RECORDS_VITALS_ACCESSED,
  EVENT_REGISTRY.MEDICAL_RECORDS_CONDITIONS_ACCESSED,
]);
