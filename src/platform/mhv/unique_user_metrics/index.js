import * as Sentry from '@sentry/browser';
import { isValidEventKey, getEventNames } from './eventRegistry';
import { logUniqueUserMetrics } from './apiClient';

/**
 * Log unique user metrics events using event keys from the registry.
 *
 * This is the main function that applications should use to log metrics.
 * It accepts event keys (not raw event names) to force developers
 * to use the centralized registry and see the database size warnings.
 *
 * Each event key can contain multiple event names that will all be logged.
 *
 * @param {string|string[]} eventKeys - Single event key or array of event keys from EVENT_REGISTRY
 *
 * @example
 * // Log a single event (which may contain multiple event names)
 * logUniqueUserMetricsEvents(EVENT_REGISTRY.SECURE_MESSAGING_MESSAGE_SENT);
 *
 * @example
 * // Log multiple event keys
 * logUniqueUserMetricsEvents([
 *   EVENT_REGISTRY.SECURE_MESSAGING_MESSAGE_SENT,
 *   EVENT_REGISTRY.SECURE_MESSAGING_INBOX_ACCESSED,
 * ]);
 */
export const logUniqueUserMetricsEvents = eventKeys => {
  // Normalize input to array
  const eventKeyArray = Array.isArray(eventKeys) ? eventKeys : [eventKeys];

  // Validate that all event keys exist in the registry
  const invalidEventKeys = eventKeyArray.filter(
    eventKey => !isValidEventKey(eventKey),
  );

  if (invalidEventKeys.length > 0) {
    Sentry.captureMessage(
      `MHV Unique User Metrics - Invalid event keys provided: 
      ${invalidEventKeys.join(', ')}. Event keys must be from EVENT_REGISTRY.`,
      'warning',
    );
    return;
  }

  // Convert event keys to event names arrays and flatten
  const eventNamesArrays = eventKeyArray
    .map(eventKey => getEventNames(eventKey))
    .filter(Boolean);
  const eventNames = eventNamesArrays.flat();

  if (eventNames.length === 0) {
    Sentry.captureMessage(
      'MHV Unique User Metrics - No valid event names to log',
      'warning',
    );
    return;
  }

  // Make the fire-and-forget API call
  logUniqueUserMetrics(eventNames);
};

// Re-export the EVENT_REGISTRY for convenience
export { EVENT_REGISTRY } from './eventRegistry';
