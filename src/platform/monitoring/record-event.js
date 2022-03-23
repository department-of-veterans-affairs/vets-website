/**
 * Helper function for reporting events to Google Analytics. An alias for window.dataLayer.push.
 * @module platform/monitoring/record-event
 * @see https://developers.google.com/tag-manager/devguide
 * @param {object} data - The event data that will be sent to GA.
 * @param {function} data.eventCallback - The function that will trigger on event completion
 */

export default function recordEvent(data) {
  const { eventCallback } = data;
  const pushEvent = () => {
    return window.dataLayer && window.dataLayer.push(data);
  };

  // Handle eventCallback when window.google_tag_manager is undefined
  // This ensures that the callback is called when GTM is not loaded
  // This is needed for localhost, and for users utilizng an adblocker
  if (typeof eventCallback === 'function' && !window.google_tag_manager) {
    pushEvent();
    return eventCallback();
  }

  // If the data includes an eventCallback, ensure we always add an
  // accompanying eventTimeout, this ensures the eventCallback is fired
  // even if the event stalls
  return pushEvent();
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
