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
  return new Promise(resolve =>
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
export const scrollToFirstError = async options => {
  const { focusOnAlertRole } = options || {};

  return new Promise(resolve => {
    setTimeout(() => {
      // [error] will focus any web-components with an error message
      const errorEl = document.querySelector(ERROR_ELEMENTS.join(','));
      if (errorEl) {
        const position = getElementPosition(errorEl);
        // Don't animate the scrolling if there is an open modal on the page. This
        // prevents the page behind the modal from scrolling if there is an error in
        // modal's form.

        // We have to search the shadow root of web components that have a slotted va-modal
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

        if (!isModalOpen) {
          scrollTo(position - 10, options);

          if (focusOnAlertRole && errorEl.tagName.startsWith('VA-')) {
            focusElement('[role="alert"]', {}, errorEl.shadowRoot);
          } else {
            focusElement(errorEl);
          }
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn('scrollToFirstError: No error found', errorEl);
      }
      resolve();
    });
  });
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
