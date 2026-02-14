/**
 * Records analytics events to the Zeta Global CDP.
 *
 * This is the central chokepoint for all analytics in the vets-website
 * codebase. Previously pushed events to Google Tag Manager's dataLayer;
 * now routes them through the Zeta bt('track') SDK.
 *
 * @module platform/monitoring/record-event
 * @see https://docs.zetaglobal.com/reference/track-event
 * @param {object} data - The event data to send to Zeta.
 * @param {string} data.event - The event name/type.
 * @param {function} [data.eventCallback] - Optional callback fired after tracking.
 */
import { zetaTrack } from './zeta/event-mapper';

export default function recordEvent(data) {
  const { eventCallback } = data;

  zetaTrack(data);

  // If an eventCallback was provided, fire it after tracking.
  // This preserves the existing behavior where callbacks are used
  // for navigation and other post-event flows.
  if (typeof eventCallback === 'function') {
    return eventCallback();
  }

  return undefined;
}

/**
 * Tracks an event only if it hasn't been recorded before in the current
 * session. Uses an internal Set to deduplicate by a given key.
 *
 * @param {object} event - The event object to push.
 * @param {string} key - The property in the event to use for deduplication.
 */
const recordedEvents = new Set();

export const recordEventOnce = (event, key) => {
  const dedupeValue = event[key];
  if (dedupeValue && recordedEvents.has(dedupeValue)) {
    return;
  }

  if (dedupeValue) {
    recordedEvents.add(dedupeValue);
  }

  recordEvent(event);
};
