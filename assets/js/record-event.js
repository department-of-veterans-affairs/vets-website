/**
 * An alias for window.dataLayer.push made available under the window so that it is accessible in content files.
 * @module module:record-event
 * @see https://developers.google.com/tag-manager/devguide
 * @see module:platform/monitoring/record-event
 * @param {object} data - The event name or object you want to send to GA.
 */
window.dataLayer = [] || window.dataLayer;
window.recordEvent = function(data) {
  window.dataLayer.push(data);
}
