import * as Sentry from '@sentry/browser';
import { EVENT_REGISTRY } from './eventRegistry';
import { logUniqueUserMetrics } from './apiClient';

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

  // Make the fire-and-forget API call with the event names
  logUniqueUserMetrics(eventValues);
};

// Re-export the EVENT_REGISTRY for convenience
export { EVENT_REGISTRY } from './eventRegistry';
