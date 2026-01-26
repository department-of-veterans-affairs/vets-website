/**
 * Get OS/browser media "prefers-reduced-motion" value
 */
export const getMotionPreference = (
  mediaQuery = window?.matchMedia('(prefers-reduced-motion: reduce)'),
) => mediaQuery?.matches || false;

/**
 * @typedef ScrollOptions
 * @type {Object}
 * @property {Number} top=0 - top scroll position (overrides calculated position)
 * @property {Number} left=0 - left scroll position
 * @property {Number} offset=0 - positive or negative top offset
 * @property {Number} delay=100 - delay scroll time (ms)
 * @property {String} behavior='smooth' - scroll type; defaults to 'instant' if
 *  user prefers reduced motion
 * @property {Number} root=null - scroll container.
 */
export const defaultScrollOptions = {
  top: 0,
  left: 0,
  offset: 0,
  delay: 0,
  behavior: 'smooth',
  // root: document,
};

const escapeCssIdentifier = value => {
  if (typeof value !== 'string') return value;
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }

  // Minimal escape fallback for environments without CSS.escape (e.g. some test runners)
  return value.replace(/[^a-zA-Z0-9_-]/g, match => `\\${match}`);
};

// Allows smooth scrolling to be overridden by our E2E tests
export function getScrollOptions(additionalOptions = {}, mediaQuery) {
  const globals = window.Forms || {};
  const motionBehavior =
    getMotionPreference(mediaQuery) ||
    (typeof Cypress !== 'undefined' && Cypress.env('CI'))
      ? { behavior: 'instant' }
      : {};

  return {
    ...defaultScrollOptions,
    ...globals.scroll,
    ...motionBehavior,
    ...additionalOptions,
  };
}

/**
 * Get element from CSS selector, element ID, element name or element classes
 * @param {String|Element} name - CSS selector; or, element ID, name, or classes
 * @param {Element} root=document - root element
 * @returns {Element}
 * @description Modified from react-scroll "get" function
 */
export const getElement = (name, root = document) =>
  typeof name === 'string'
    ? root.querySelector?.(name) ||
      root.querySelector?.(`#${escapeCssIdentifier(name)}`) ||
      root.querySelector?.(`[name="${escapeCssIdentifier(name)}"]`) ||
      root.getElementById?.(name) ||
      root.getElementsByName?.(name)[0] ||
      root.getElementsByClassName?.(name)[0]
    : name;

/**
 * Get page Y scroll position
 * @returns {Number} - page Y scroll position
 */
export const getPageYPosition = () =>
  window.pageYOffset ||
  document.documentElement.scrollTop ||
  document.body.scrollTop ||
  0;

/**
 * Get element scroll position on the page
 * @param {String|Element} el - selector or element to get top scroll position
 * @param {Element} root=document - root element (for testing)
 * @returns {Number}
 */
export const getElementPosition = (el, root = document) => {
  const type = typeof el;
  if (type === 'number') {
    return el;
  }

  const elm = getElement(el, root);
  if (type === 'undefined' || !elm) {
    // eslint-disable-next-line no-console
    console.warn('Element not found', el);
    return 0;
  }

  // Using scrollTo, so return the current page scroll plus element top
  return getPageYPosition() + (elm?.getBoundingClientRect?.().top || 0);
};
