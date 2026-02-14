/**
 * Translates GA dataLayer event objects into Zeta CDP bt('track') calls.
 *
 * The existing codebase pushes objects like
 *   { event: 'cta-button-click', 'button-label': 'Submit' }
 * to window.dataLayer. This module converts that format into Zeta's
 * bt('track', eventType, properties) API.
 *
 * @module platform/monitoring/zeta/event-mapper
 * @see https://docs.zetaglobal.com/reference/track-event
 */

/**
 * Converts a kebab-case string to camelCase.
 * e.g. 'button-label' → 'buttonLabel'
 */
const kebabToCamel = str =>
  str.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());

/**
 * Properties from GA dataLayer pushes that should not be forwarded as
 * Zeta event properties. These are either GA/GTM internals or handled
 * separately.
 */
const EXCLUDED_KEYS = new Set([
  'event',
  'eventCallback',
  'eventTimeout',
  'gtm.uniqueEventId',
]);

/**
 * Zeta reserves these property names — they cannot be used as custom
 * properties in bt('track') calls.
 * @see https://docs.zetaglobal.com/reference/track-event
 */
const ZETA_RESERVED_KEYS = new Set([
  'enriched',
  'eventId',
  'geolocation',
  'httpMethod',
  'identified',
  'identity',
  'isBot',
  'isTest',
  'properties',
  'referer',
  'status',
  'userAgent',
  'href',
  'bsin',
]);

/**
 * Returns true if a dataLayer push is a "clear" push where all non-event
 * properties are set to undefined. These are used by the component library
 * analytics setup to prevent dataLayer bleed and have no meaning in Zeta.
 */
const isClearPush = data => {
  if (data.event) return false;
  return Object.keys(data).every(
    key => key === 'event' || data[key] === undefined,
  );
};

/**
 * Transforms a GA dataLayer object into Zeta-compatible properties.
 * Converts kebab-case keys to camelCase and strips excluded/reserved keys.
 */
const mapProperties = data => {
  const props = {};
  Object.keys(data).forEach(key => {
    if (EXCLUDED_KEYS.has(key)) return;

    const camelKey = kebabToCamel(key);
    if (ZETA_RESERVED_KEYS.has(camelKey)) return;

    const value = data[key];
    if (value === undefined || value === null) return;

    props[camelKey] = value;
  });
  return props;
};

/**
 * Sends an analytics event to Zeta Global's CDP via bt('track').
 *
 * If the Zeta SDK (window.bt) is not yet loaded, the call is silently
 * dropped — this mirrors how the old recordEvent silently dropped events
 * when window.dataLayer was undefined.
 *
 * @param {object} data - A GA-style dataLayer event object.
 *   Must contain an `event` property. Additional properties are forwarded
 *   as Zeta event properties with kebab-case keys converted to camelCase.
 */
export const zetaTrack = data => {
  // Skip dataLayer "clear" pushes — Zeta events are self-contained.
  if (isClearPush(data)) return;

  const eventType = data.event;
  if (!eventType) return;

  const properties = mapProperties(data);
  const settings = {};

  // Preserve eventCallback by wiring it to Zeta's onComplete hook.
  if (typeof data.eventCallback === 'function') {
    settings.onComplete = data.eventCallback;
  }

  if (typeof window.bt === 'function') {
    const hasSettings = Object.keys(settings).length > 0;
    if (hasSettings) {
      window.bt('track', eventType, properties, settings);
    } else {
      window.bt('track', eventType, properties);
    }
  } else if (typeof data.eventCallback === 'function') {
    // If bt() isn't loaded yet, still fire the callback so navigation
    // and other callback-dependent flows aren't blocked.
    data.eventCallback();
  }
};
