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
 * Helper to check if a component has focusable inputs, checking nested shadow DOMs
 * @param {Element} element - The element to check
 * @returns {boolean} - True if any input/select/textarea found at any level
 */
const hasInputInShadowDOM = element => {
  // Check direct shadow DOM
  if (element?.shadowRoot?.querySelector('input, select, textarea')) {
    return true;
  }

  // Check one level deeper (nested web components)
  const childComponents = element?.shadowRoot?.querySelectorAll('*');
  if (childComponents) {
    for (const child of childComponents) {
      if (child.shadowRoot?.querySelector('input, select, textarea')) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Clean up error annotations from web components that no longer have errors
 */
export const cleanupErrorAnnotations = () => {
  // Find all web components that might have error attributes
  const allComponents = document.querySelectorAll(
    '[error], [input-error], [checkbox-error]',
  );
  allComponents.forEach(component => {
    const errorMessage =
      component.getAttribute('error') ||
      component.getAttribute('input-error') ||
      component.getAttribute('checkbox-error') ||
      component.error;
    if (!errorMessage) {
      // No error - remove sr-only error span from legend if it exists
      const legend = component.shadowRoot?.querySelector('legend');
      if (legend) {
        const errorSpan = legend.querySelector('.sr-only-error');
        if (errorSpan) {
          errorSpan.remove();
        }
      }
    }
  });
};

// Set up a MutationObserver to clean up errors when attributes change
if (typeof window !== 'undefined') {
  const observer = new MutationObserver(() => {
    cleanupErrorAnnotations();
  });

  // Start observing when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['error'],
        subtree: true,
      });
    });
  } else {
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['error'],
      subtree: true,
    });
  }
}

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
  return new Promise(resolve => {
    const { focusOnAlertRole = false, errorContext } = options;
    const selectors = ERROR_ELEMENTS.join(',');
    const timeout = 500;
    const observerConfig = { childList: true, subtree: true };
    const rootEl = document.querySelector('#react-root') || document.body;
    let fallbackTimer;
    let observer;

    const runCleanup = el => {
      if (!el) {
        console.warn('scrollToFirstError: Error element not found', el);
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
          // First, clean up any components that no longer have errors
          cleanupErrorAnnotations();

          // Set up aria-describedby for all elements in error state
          const allErrorElements = document.querySelectorAll(selectors);
          allErrorElements.forEach(errorWebComponent => {
            const errorElement = errorWebComponent?.shadowRoot?.querySelector(
              '[role="alert"], #input-error-message, #radio-error-message',
            );

            if (errorElement) {
              // Get or create a unique ID for the error element
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

              // Check if there's a focusable input element (including nested shadow DOMs)
              const hasInput = hasInputInShadowDOM(errorWebComponent);

              if (!hasInput) {
                // No input found - add sr-only error to legend for components like radio/checkbox groups
                const errorMessage =
                  errorWebComponent.getAttribute('error') ||
                  errorWebComponent.getAttribute('input-error') ||
                  errorWebComponent.getAttribute('checkbox-error') ||
                  errorWebComponent.error;
                const legend = errorWebComponent.shadowRoot?.querySelector(
                  'legend',
                );

                if (
                  errorMessage &&
                  legend &&
                  !legend.querySelector('.sr-only-error')
                ) {
                  const errorText = errorMessage
                    .replace(/^Error\s*/i, '')
                    .trim();
                  const errorSpan = document.createElement('span');
                  errorSpan.className = 'usa-sr-only sr-only-error';
                  errorSpan.textContent = `Error: ${errorText}. `;
                  legend.insertBefore(errorSpan, legend.firstChild);
                }
              } else {
                // For other inputs, use aria-describedby
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
            }
          });

          // Now focus the first error's input
          // Try to find a focusable element, fallback to legend if none found
          let focusTarget;

          // Try to find a focusable input element
          // 1. First check if there's a child component with an error (for nested web components)
          let childWithError = null;
          if (el?.shadowRoot) {
            childWithError = Array.from(el.shadowRoot.children).find(
              child =>
                child.hasAttribute('error') &&
                child.getAttribute('error') !== '',
            );
          }
          if (childWithError) {
            focusTarget = childWithError.shadowRoot?.querySelector(
              'input, select, textarea',
            );
          }

          // 2. If not found, try direct input at current level
          if (!focusTarget) {
            focusTarget = el?.shadowRoot?.querySelector(
              'input, select, textarea',
            );
          }

          // 3. If still not found, search one level deeper in all child components
          if (!focusTarget && el?.shadowRoot) {
            const childComponents = el.shadowRoot.querySelectorAll('*');
            for (const child of childComponents) {
              const nestedInput = child.shadowRoot?.querySelector(
                'input, select, textarea',
              );
              if (nestedInput) {
                focusTarget = nestedInput;
                break;
              }
            }
          }

          // 4. Fallback: focus legend if no inputs found (for radio/checkbox groups)
          if (!focusTarget) {
            const legend = el?.shadowRoot?.querySelector('legend');
            if (legend) {
              legend.setAttribute('tabindex', '-1');
              focusTarget = legend;
            }
          }

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

    const queryForErrors = () => {
      const el = document.querySelector(selectors);
      if (el) scrollAndFocus(el);
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
