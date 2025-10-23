/**
 * Captures Google analytics events when redux actions are fired.
 *
 * @typedef {Object} Event
 * @property {string} action The name of the redux action which triggers capturing the event
 * @property {string|function} event The name of the event to capture or a function which returns the name
 * ---
 * @param {Array<Event>} analyticsEvents An array containing the events to capture when the appropriate redux
 *                                       action is fired
 */
function createAnalyticsMiddleware(analyticsEvents) {
  // Maps are much faster than objects when the key isn't found
  const eventMap = new Map(analyticsEvents.map(event => [event.action, event]));

  return store => next => action => {
    // When an action is fired, search for the corresponding action in the event map and capture the event
    const e = eventMap.get(action.type);
    if (e) {
      const event =
        typeof e.event === 'function' ? e.event(store, action) : e.event;
      window.dataLayer.push(typeof event === 'string' ? { event } : event);
    }

    return next(action);
  };
}

export default createAnalyticsMiddleware;
