/**
 * Captures analytics events when Redux actions are fired, sending them
 * to the Zeta Global CDP via bt('track').
 *
 * @typedef {Object} Event
 * @property {string} action The Redux action type that triggers the event.
 * @property {string|function} event The event name, or a function returning
 *   the event name/object. Functions receive (store, action) as arguments.
 * ---
 * @param {Array<Event>} analyticsEvents Events to capture when matching
 *   Redux actions fire.
 */
import { zetaTrack } from '../monitoring/zeta/event-mapper';

function createAnalyticsMiddleware(analyticsEvents) {
  // Maps are much faster than objects when the key isn't found
  const eventMap = new Map(analyticsEvents.map(event => [event.action, event]));

  return store => next => action => {
    // When an action is fired, search for the corresponding action in
    // the event map and send to Zeta.
    const e = eventMap.get(action.type);
    if (e) {
      const event =
        typeof e.event === 'function' ? e.event(store, action) : e.event;
      zetaTrack(typeof event === 'string' ? { event } : event);
    }

    return next(action);
  };
}

export default createAnalyticsMiddleware;
