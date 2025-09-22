import * as Sentry from '@sentry/browser';
import {
  EVENT_REGISTRY,
  ORACLE_HEALTH_TRACKED_SITES,
  ORACLE_HEALTH_TRACKED_EVENTS,
} from './eventRegistry';
import { logUniqueUserMetrics } from './apiClient';

/**
 * Get the user's tracked Oracle Health facility IDs from the Redux store.
 * This function safely accesses the user's profile facilities and filters
 * to only those facilities that we're tracking events for.
 *
 * @returns {string[]} Array of facility IDs that are tracked Oracle Health sites
 */
const getUserTrackedOracleHealthFacilities = () => {
  // Access the Redux store - this is available globally in the VA.gov app
  const state = window.store?.getState?.();
  const facilities = state?.user?.profile?.facilities || [];

  // Get all Oracle Health tracked site IDs
  const oracleHealthSiteIds = Object.values(ORACLE_HEALTH_TRACKED_SITES);

  // Filter user's facilities to only Oracle Health sites
  return facilities
    .map(facility => facility.facilityId)
    .filter(facilityId => oracleHealthSiteIds.includes(facilityId));
};

/**
 * Log unique user metrics events using event values from the registry.
 *
 * This is the main function that applications should use to log metrics.
 * It accepts event values (strings) from EVENT_REGISTRY to force developers
 * to use the centralized registry and see the database size warnings.
 *
 * @param {...string} eventValues - One or more event values from EVENT_REGISTRY
 *
 * @example
 * // Log a single event
 * logUniqueUserMetricsEvents(EVENT_REGISTRY.SECURE_MESSAGING_MESSAGE_SENT);
 *
 * @example
 * // Log multiple events
 * logUniqueUserMetricsEvents(
 *   EVENT_REGISTRY.SECURE_MESSAGING_MESSAGE_SENT,
 *   EVENT_REGISTRY.SECURE_MESSAGING_INBOX_ACCESSED,
 * );
 */
export const logUniqueUserMetricsEvents = (...eventValues) => {
  // Get all valid registry values (strings)
  const validRegistryValues = Object.values(EVENT_REGISTRY);

  // Validate that all passed values are from the registry
  const invalidEventValues = eventValues.filter(
    eventValue => !validRegistryValues.includes(eventValue),
  );

  if (invalidEventValues.length > 0) {
    Sentry.captureMessage(
      `MHV Unique User Metrics - Invalid event values provided. ` +
        'Event values must be from EVENT_REGISTRY (e.g., EVENT_REGISTRY.SECURE_MESSAGING_MESSAGE_SENT).',
      'warning',
    );
    return;
  }

  if (eventValues.length === 0) {
    Sentry.captureMessage(
      'MHV Unique User Metrics - No valid event names to log',
      'warning',
    );
    return;
  }

  // Get user's tracked Oracle Health facilities
  const userOracleHealthFacilities = getUserTrackedOracleHealthFacilities();

  // Create array to hold all events to log (original + site-specific)
  const allEventsToLog = [...eventValues];

  // If user has Oracle Health facilities, add site-specific events
  if (userOracleHealthFacilities.length > 0) {
    eventValues.forEach(eventValue => {
      // Check if this event should have Oracle Health site-specific logging
      if (ORACLE_HEALTH_TRACKED_EVENTS.includes(eventValue)) {
        // Add site-specific events for each of the user's Oracle Health facilities
        userOracleHealthFacilities.forEach(facilityId => {
          allEventsToLog.push(`${eventValue}_oh_site_${facilityId}`);
        });
      }
    });
  }

  // Make the fire-and-forget API call with all events (original + site-specific)
  logUniqueUserMetrics(allEventsToLog);
};

// Re-export constants for convenience
export {
  EVENT_REGISTRY,
  ORACLE_HEALTH_TRACKED_SITES,
  ORACLE_HEALTH_TRACKED_EVENTS,
} from './eventRegistry';
