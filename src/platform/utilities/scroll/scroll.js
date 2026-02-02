/* eslint-disable no-console */
import { getScrollOptions, getElementPosition } from './utils';
import { focusElement, focusByOrder, defaultFocusSelector } from '../ui/focus';
import { ERROR_ELEMENTS, SCROLL_ELEMENT_SUFFIX } from '../constants';
import environment from '../environment';
import {
  cleanupErrorAnnotations as cleanupErrorAnnotationsInternal,
  DEFAULT_SCAFFOLD_AND_FOCUS_FORM_ERRORS,
  findFocusTarget,
  isSupportedVaElement,
  scaffoldErrorsFromSelectors,
} from './error-scaffolding';

export const cleanupErrorAnnotations = cleanupErrorAnnotationsInternal;

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
    window.scrollTo({
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
 * @property {Boolean} scaffoldAndFocusFormErrors - When a supported VA web component has an
 *  error, find and focus on the first input element inside its shadow DOM. Set to false
 *  to opt out and focus on the error element itself instead.
 */
/**
 * Find first error and scroll it to the top of the page, then focus on it
 * @param {ScrollOptions & scrollToFirstErrorOptions} options
 */
export const scrollToFirstError = async (options = {}) => {
  return new Promise(resolve => {
    const {
      focusOnAlertRole = false,
      scaffoldAndFocusFormErrors = DEFAULT_SCAFFOLD_AND_FOCUS_FORM_ERRORS,
      errorContext,
    } = options;
    const selectors = ERROR_ELEMENTS.join(',');
    const timeout = 500;
    const observerConfig = { childList: true, subtree: true };
    const rootEl = document.querySelector('#react-root') || document.body;
    let fallbackTimer;
    let observer;

    const runCleanup = el => {
      if (!el) {
        // Suppress warning in test environments to avoid noisy output
        if (!window.Mocha) {
          console.warn('scrollToFirstError: Error element not found', el);
        }
        if (
          !window.Mocha &&
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
      }
      clearTimeout(fallbackTimer);
      observer?.disconnect();
      resolve();
    };

    const scrollAndFocus = el => {
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
        scrollTo(position - 10, options);

        if (focusOnAlertRole) {
          // Adding a delay so that the shadow DOM needs to render and attach
          // before we try to focus on the element; without the setTimeout,
          // focus ends up staying on the "Continue" button
          requestAnimationFrame(() => {
            focusElement('[role="alert"]', {}, el?.shadowRoot);
          });
        } else if (scaffoldAndFocusFormErrors && isSupportedVaElement(el)) {
          scaffoldErrorsFromSelectors(selectors);

          // Find and focus the appropriate input element
          const focusTarget = findFocusTarget(el);
          if (focusTarget) {
            setTimeout(() => {
              focusTarget.focus({ preventScroll: true });
            }, 100);
          }
        } else {
          focusElement(el);
        }
      }

      runCleanup(true);
    };

    /**
     * Queries for error elements and scrolls to focus on them.
     * Prioritizes focusing on nested child error elements within shadow DOM,
     * falling back to the parent element if no child errors are found.
     */
    const queryForErrors = () => {
      const el = document.querySelector(selectors);
      if (el) {
        // Check if this element has child components with errors (nested errors)
        const childWithError = el.shadowRoot?.querySelector(
          '[error]:not([error=""])',
        );
        if (childWithError) {
          // If there's a child with error, focus that instead of the parent
          scrollAndFocus(childWithError);
        } else {
          scrollAndFocus(el);
        }
      }
    };

    // use MutationObserver to only watch `addedNodes` for the selectors
    observer = new MutationObserver(mutations => {
      for (const { addedNodes } of mutations) {
        for (const node of Array.from(addedNodes)) {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches?.(selectors) || node.querySelector?.(selectors))
          ) {
            queryForErrors();
            return;
          }
        }
      }
    });
    if (rootEl) observer.observe(rootEl, observerConfig);

    // don't let the observer run forever
    fallbackTimer = setTimeout(() => runCleanup(false), timeout);

    // run an initial check for any existing elements
    queryForErrors();
  });
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
