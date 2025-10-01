import { useEffect } from 'react';
import environment from 'platform/utilities/environment';

// Event types
export const ARRAY_BUILDER_EVENTS = {
  INCOMPLETE_ITEM_ERROR: 'incompleteItemError',
  DUPLICATE_ITEM_ERROR: 'duplicateItemError',
};

// Internal event registry
const eventRegistry = new Map();

/**
 * Create and dispatch a custom event
 * @param {string} eventType - The event type from ARRAY_BUILDER_EVENTS
 * @param {Object} event - Event payload
 */
export const dispatchArrayBuilderEvent = (eventType, event = {}) => {
  const handlers = eventRegistry.get(eventType) || [];
  handlers.forEach(handler => {
    try {
      handler(event);
    } catch (error) {
      if (!environment.isProduction()) {
        // eslint-disable-next-line no-console
        console.error(
          `Error in ArrayBuilder event handler for ${eventType}:`,
          error,
        );
      }
    }
  });
};

/**
 * Subscribe to an ArrayBuilder event
 * @param {string} eventType - The event type to listen for
 * @param {Function} handler - Event handler function
 * @returns {Function} Unsubscribe function
 */
export const subscribeToArrayBuilderEvent = (eventType, handler) => {
  if (!eventRegistry.has(eventType)) {
    eventRegistry.set(eventType, []);
  }

  const handlers = eventRegistry.get(eventType);
  handlers.push(handler);

  // Return unsubscribe function
  return () => {
    const currentHandlers = eventRegistry.get(eventType);
    if (currentHandlers) {
      const index = currentHandlers.indexOf(handler);
      if (index > -1) {
        currentHandlers.splice(index, 1);
      }
    }
  };
};

/**
 * Dispatch incomplete item error event
 * @param {Object} event - Error event
 * @param {number} event.index - Item index
 * @param {string} event.arrayPath - array data path (e.g. 'treatmentRecords')
 */
export const dispatchIncompleteItemError = event => {
  dispatchArrayBuilderEvent(ARRAY_BUILDER_EVENTS.INCOMPLETE_ITEM_ERROR, event);
};

/**
 * Dispatch duplicate item error event
 * @param {Object} event - Error event
 * @param {number} event.index - Item index
 * @param {string} event.arrayPath - array data path (e.g. 'childrenToAdd')
 */
export const dispatchDuplicateItemError = event => {
  dispatchArrayBuilderEvent(ARRAY_BUILDER_EVENTS.DUPLICATE_ITEM_ERROR, event);
};

/**
 * Hook for subscribing to ArrayBuilder events in React components
 * @param {string} eventType - Event type to subscribe to
 * @param {Function} handler - Event handler
 */
export const useArrayBuilderEvent = (eventType, handler) => {
  useEffect(
    () => {
      return subscribeToArrayBuilderEvent(eventType, handler);
    },
    [eventType, handler],
  );
};
