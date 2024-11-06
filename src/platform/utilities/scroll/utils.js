/**
 * Get OS/browser media "prefers-reduced-motion" value
 */
export const getMotionPreference = () =>
  window?.matchMedia('(prefers-reduced-motion: reduce)')?.matches || false;

/**
 * Get element from CSS selector, element ID, element name or element classes
 * @param {String|Element} name - CSS selector; or, element ID, name, or classes
 * @param {*} root=document - root element
 * @returns {Element}
 * @description Modified from react-scroll "get" function
 */
export const getElement = (name, root = document) =>
  typeof name === 'string'
    ? root.querySelector(name) ||
      root.getElementById(name) ||
      root.getElementsByName(name)[0] ||
      root.getElementsByClassName(name)[0]
    : name;

/**
 * Get element scroll position on the page
 * @param {String|Element} el - selector or element to get top scroll position
 * @param {Element} root=document - root element (for testing)
 * @returns {Number}
 */
export const getElementPosition = (el, root) => {
  const type = typeof el;
  const elm = getElement(el, root);

  const currentYPosition =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;

  if (type === 'undefined' || !elm) {
    // eslint-disable-next-line no-console
    console.error('Element not found', el);
    return 0;
  }

  if (type === 'number') {
    return el;
  }

  // Using scrollBy, so return the position difference
  return currentYPosition + (elm?.getBoundingClientRect?.().top || 0);
};
