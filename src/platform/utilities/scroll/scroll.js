/* eslint-disable no-console */
import { getScrollOptions, getElementPosition } from './utils';
import { focusElement, focusByOrder, defaultFocusSelector } from '../ui/focus';
import { ERROR_ELEMENTS, SCROLL_ELEMENT_SUFFIX } from '../constants';
import environment from '../environment';

// Let the form system control scroll behavior
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
 * @param {String|Number|Element} [position='topScrollElement'] - top scroll element, or
 *  selector, id, name, class name, number, or DOM element to position
 * @param {ScrollOptions} [scrollOptions] - settings & overrides
 * @returns {Promise<void>}
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
  const { focusOnAlertRole = false, errorContext } = options;
  const selectors = ERROR_ELEMENTS.join(',');
  const el = document.querySelector(selectors);

  if (!el) {
    console.warn('scrollToFirstError: Error element not found');
    if (
      !environment.isProduction() &&
      Array.isArray(errorContext) &&
      errorContext.length &&
      errorContext.some(err =>
        err?.stack?.includes('You must provide a response'),
      )
    ) {
      const fieldKeys = errorContext
        .filter(err => err?.stack?.includes('You must provide a response'))
        .map(err => err.stack.split(':')[0]);
      console.warn(
        `Schema validation error: The following fields are marked as required in your schema but do not exist in the page:\n${fieldKeys
          .map(key => `- "${key}"`)
          .join(
            '\n',
          )}\nCheck your required fields in the schema match the fields in your UI.`,
      );
    }
    return;
  }

  // check for any modals that would interfere with scrolling
  const isShadowRootModalOpen = Array.from(
    document.querySelectorAll('va-omb-info'),
  ).some(({ shadowRoot }) =>
    shadowRoot?.querySelector('va-modal[visible]:not([visible="false"])'),
  );
  const isModalOpen =
    document.body.classList.contains('modal-open') ||
    document.querySelector('va-modal[visible]:not([visible="false"])') ||
    isShadowRootModalOpen;

  // prevent page scroll if there is an open modal, as the error could
  // be within the modal itself
  if (!isModalOpen) {
    const position = getElementPosition(el);
    await scrollTo(position - 10, options);

    if (focusOnAlertRole) {
      // Process ALL error elements on the page to set up aria-describedby
      const allErrorElements = document.querySelectorAll(selectors);
      allErrorElements.forEach(errorWebComponent => {
        const errorElement = errorWebComponent?.shadowRoot?.querySelector(
          '[role="alert"], #input-error-message',
        );

        if (errorElement) {
          // Get or create an ID for the error element
          let errorId = errorElement.id;
          if (!errorId) {
            errorId = `input-error-message-${Math.random()
              .toString(36)
              .substr(2, 9)}`;
            errorElement.id = errorId;
          }

          // Remove role=alert to prevent interference with aria-describedby announcements
          errorElement.removeAttribute('role');
          errorElement.removeAttribute('aria-live');

          // Find the corresponding input element
          const inputElement = errorWebComponent?.shadowRoot?.querySelector(
            'input, select, textarea',
          );

          if (inputElement) {
            // Associate the error message with the input using aria-describedby
            const existingDescribedBy = inputElement.getAttribute(
              'aria-describedby',
            );
            if (
              !existingDescribedBy ||
              !existingDescribedBy.includes(errorId)
            ) {
              inputElement.setAttribute(
                'aria-describedby',
                existingDescribedBy
                  ? `${existingDescribedBy} ${errorId}`
                  : errorId,
              );
            }
          }
        }
      });

      // Now focus the first error's input
      const firstErrorInput = el?.shadowRoot?.querySelector(
        'input, select, textarea',
      );
      if (firstErrorInput) {
        setTimeout(() => {
          firstErrorInput.focus({ preventScroll: true });
        }, 100);
      }
    } else {
      focusElement(el, { preventScroll: true });
    }
  }
};

export const scrollAndFocus = (target, options) =>
  new Promise(resolve => {
    if (target) {
      scrollTo(target, options);
      focusElement(target, { preventScroll: true });
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
