import { getScrollOptions, getElementPosition } from './utils';

import { focusElement, focusByOrder, defaultFocusSelector } from '../ui/focus';
import { ERROR_ELEMENTS, SCROLL_ELEMENT_SUFFIX } from '../constants';

// Let form system controll scroll behavior
window.history.scrollRestoration = 'manual';

/**
 * Scroll element to top of the page
 * @param {String|Number|Element} el - selector, id, name, class name, number,
 *  or DOM element to position
 * @param {ScrollOptions} scrollOptions - settings & overrides
 * @returns Promise
 */
export const scrollTo = async (el, scrollOptions) => {
  const options = getScrollOptions(scrollOptions);
  const scroll = resolve => {
    const top =
      (options.top || getElementPosition(el, options.root)) +
      (options.offset || 0);
    // Scroll to calculated position
    document.body.scrollTo({
      top: Math.round(top),
      left: options.left || 0,
      behavior: options.behavior,
    });
    resolve();
  };
  return new Promise(
    resolve =>
      options.delay
        ? setTimeout(() => {
            scroll(resolve);
          }, options.delay)
        : scroll(resolve),
  );
};

/**
 * scrollTo alias
 * Scroll element to top of the page
 * @param {String|Number|Element} el - selector, id, name, class name, number,
 *  or DOM element to position
 * @param {ScrollOptions} scrollOptions - settings & overrides
 * @returns Promise
 */
export const scrollToElement = async (el, scrollOptions) =>
  scrollTo(el, scrollOptions);

/**
 * Scroll to top of the page
 * @param {String|Number|Element} el='topScrollElement' - top scroll element, or
 *  selector, id, name, class name, number, or DOM element to position
 * @param {ScrollOptions} scrollOptions - settings & overrides
 * @returns Promise
 */
export const scrollToTop = async (
  position = `top${SCROLL_ELEMENT_SUFFIX}`,
  scrollOptions,
) => scrollTo(position, scrollOptions);

/**
 * scrollToFirstError options
 * @typedef scrollToFirstErrorOptions
 * @type {Object}
 * @property {Boolean} focusOnAlertRole=false - When a web component is targetted, find
 *  and focus on the element with role=alert to ensure screen readers are
 *  reading out the correct content; it's set default to false while we perform
 *  further accessibility evaluation
 */
/**
 * Find first error and scroll it to the top of the page, then focus on it
 * @param {ScrollOptions & scrollToFirstErrorOptions} options
 */
export const scrollToFirstError = async (options = {}) => {
  const { focusOnAlertRole = false, maxWait = 500, retryDelay = 25 } = options;

  // initialize retry logic for finding error element
  const waitForElement = (selector, timeout = maxWait) => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const runCheck = () => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        if (Date.now() - start > timeout) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return reject({
            message: 'Error element not found',
            element: selector,
          });
        }
        return setTimeout(runCheck, retryDelay);
      };
      runCheck();
    });
  };

  try {
    const selector = ERROR_ELEMENTS.join(',');
    const errorEl = await waitForElement(selector);
    const position = getElementPosition(errorEl);

    // check for any modals that would interfere with scrolling
    const isShadowRootModalOpen = Array.from(
      document.querySelectorAll('va-omb-info'),
    ).some(ombInfo =>
      ombInfo.shadowRoot?.querySelector(
        'va-modal[visible]:not([visible="false"])',
      ),
    );
    const isModalOpen =
      document.body.classList.contains('modal-open') ||
      document.querySelector('va-modal[visible]:not([visible="false"])') ||
      isShadowRootModalOpen;

    // prevent page scroll if there is an open modal, as the error could
    // be within the modal itself
    if (!isModalOpen) {
      scrollTo(position - 10, options);

      if (focusOnAlertRole && errorEl.tagName.startsWith('VA-')) {
        focusElement('[role="alert"]', {}, errorEl.shadowRoot);
      } else {
        focusElement(errorEl);
      }
    }
  } catch ({ message, element }) {
    // eslint-disable-next-line no-console
    console.warn(`scrollToFirstError: ${message}`, element);
  }
};

export const scrollAndFocus = (target, options) =>
  new Promise(resolve => {
    if (target) {
      scrollTo(target, options);
      focusElement(target);
    }
    resolve();
  });

/**
 * Custom focus - focuses on a page's H3 by default (unique header) if it exists
 * will fall back to the breadcrumb H2 (Step _ of _). This function is called
 * only if the formConfig includes a `useCustomScrollAndFocus: true`, then it
 * checks the page's `scrollAndFocusTarget` setting which is either a string or
 * function to allow for custom focus management, e.g. returning to a page after
 * editing a value to ensure focus is returned to the edit link
 * @param {String|Function} scrollAndFocusTarget - Custom focus target
 * @param {Number} pageIndex - index inside of a page array loop
 * @param {ScrollOptions} options - settings & overrides
 */
export const customScrollAndFocus = (
  scrollAndFocusTarget,
  pageIndex,
  options = {},
) =>
  new Promise(resolve => {
    setTimeout(() => {
      if (typeof scrollAndFocusTarget === 'string') {
        scrollAndFocus(document.querySelector(scrollAndFocusTarget));
      } else if (typeof scrollAndFocusTarget === 'function') {
        scrollAndFocusTarget(pageIndex);
      } else {
        scrollToTop(`top${SCROLL_ELEMENT_SUFFIX}`, options);
        // h3 should be a unique header on the page
        focusByOrder(['#main h3', defaultFocusSelector]);
      }
      resolve();
    }, options.delay || 150);
  });
