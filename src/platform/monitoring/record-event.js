/**
 * Helper function for reporting events to Google Analytics. An alias for window.dataLayer.push.
 * @module platform/monitoring/record-event
 * @see https://developers.google.com/tag-manager/devguide
 * @param {object} data - The event data that will be sent to GA.
 */

export default function recordEvent(data) {
  return window.dataLayer && window.dataLayer.push(data);
}

/**
 * Pushes an event to the Analytics dataLayer if the event doesn't already
 * exist there. If the event contains a `key` property whose value matches an
 * existing item in the dataLayer with the same key/value pair, the whole event
 * and all of its properties will be skipped.
 * @param {object} event this will get pushed to `dataLayer`.
 * @param {string} key the property in the event object to use when looking for
 *                     existing matches in the dataLayer
 */
export const recordEventOnce = (event, key) => {
  const alreadyRecorded =
    window.dataLayer &&
    !!window.dataLayer.find(item => item[key] === event[key]);

  if (!alreadyRecorded) {
    recordEvent(event);
  }
};
