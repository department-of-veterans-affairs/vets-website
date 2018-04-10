/**
 * Helper function for reporting events to Google Analytics. Alias for window.dataLayer.push and window.recordEvent.
 * @module platform/monitoring/record-event
 * @see module:record-event
 */

export default function recordEvent(data) {
  window.dataLayer.push(data);
}
