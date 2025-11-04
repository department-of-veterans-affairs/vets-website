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
 * Get error message text from a web component
 * @param {Element} el - The web component element
 * @returns {string} The error message text
 */
const getErrorMessage = el => {
  return (
    el.getAttribute('error') ||
    el.getAttribute('input-error') ||
    el.getAttribute('checkbox-error') ||
    el.error ||
    ''
  );
};

/**
 * Get label text from a web component
 * @param {Element} el - The web component element
 * @returns {string} The label text
 */
const getLabelText = el => {
  // Try to get from label prop first
  let labelText = el.getAttribute('label') || el.label || '';

  if (!labelText) {
    // Fall back to extracting from label element in shadow DOM
    const labelElement = el.shadowRoot?.querySelector('label');
    if (labelElement) {
      // Clone and remove error messages to get clean label text
      const clone = labelElement.cloneNode(true);
      const errorElements = clone.querySelectorAll(
        '[role="alert"], #input-error-message, #radio-error-message, .usa-error-message',
      );
      errorElements.forEach(err => err.remove());
      labelText = clone.textContent.trim();
    }
  }

  return labelText;
};

/**
 * Build aria-label for an error element
 * @param {Element} el - The web component element
 * @returns {string} The formatted aria-label text
 */
const buildErrorAriaLabel = el => {
  const errorMessage = getErrorMessage(el);
  const labelText = getLabelText(el);

  if (!errorMessage || !labelText) {
    return '';
  }

  const errorText = errorMessage.replace(/^Error\s*/i, '').trim();

  return `Error: ${errorText}. ${labelText}.`;
};

/**
 * Find a focusable element within nested shadow DOMs
 * @param {Element} el - The web component element
 * @returns {Element|null} The focusable element or null
 */
const findFocusableElement = el => {
  // Level 1: Check direct shadow DOM for input, select, textarea, or legend
  let focusable = el.shadowRoot?.querySelector(
    'input, select, textarea, legend',
  );
  if (focusable) return focusable;

  // Level 2: Check child elements' shadow DOMs
  const children = el.shadowRoot?.querySelectorAll('*');
  if (children) {
    for (const child of children) {
      if (child.shadowRoot) {
        focusable = child.shadowRoot.querySelector(
          'input, select, textarea, legend',
        );
        if (focusable) return focusable;
      }
    }
  }

  return null;
};

/**
 * Set up aria-labelledby on error element with hidden label span
 * @param {Element} el - The web component element
 */
const setUpErrorAriaLabel = el => {
  const labelText = buildErrorAriaLabel(el);

  if (labelText && el.shadowRoot) {
    // Create a unique ID for this error label
    const labelId = `error-label-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Find the target element (input for most components, fieldset for va-radio)
    let target = el.shadowRoot.querySelector('input, select, textarea');

    // If no input found, try fieldset (for va-radio, va-checkbox-group)
    if (!target) {
      target = el.shadowRoot.querySelector('fieldset');
    }

    if (!target) return;

    // Create a hidden span with the label text inside the shadow root
    const labelSpan = document.createElement('span');
    labelSpan.id = labelId;
    labelSpan.className = 'usa-sr-only';
    labelSpan.textContent = labelText;
    el.shadowRoot.appendChild(labelSpan);

    // Set aria-labelledby on the target element
    target.setAttribute('aria-labelledby', labelId);
    // Remove aria-describedby to prevent conflicts with aria-labelledby
    target.removeAttribute('aria-describedby');

    // Store the label ID for potential cleanup
    // eslint-disable-next-line no-param-reassign
    el.dataset.errorLabelId = labelId;
  }
};

/**
 * Focus the first error element
 * @param {Element} el - The web component element
 */
const focusErrorElement = el => {
  // Find and focus the actual focusable element inside shadow DOM
  const focusTarget = findFocusableElement(el);
  if (focusTarget) {
    // Make legend focusable if needed
    if (focusTarget.tagName === 'LEGEND') {
      focusTarget.setAttribute('tabindex', '-1');
    }
    setTimeout(() => {
      focusElement(focusTarget);
    }, 100);
  } else {
    // Fallback: focus the custom element itself
    setTimeout(() => {
      focusElement(el);
    }, 100);
  }
};

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

        // Remove role="alert" and aria-describedby from all error elements on the page
        // Debounced removal to optimize timing
        const removeAriaDescribedBy = () => {
          const allErrorElements = document.querySelectorAll('*');
          allErrorElements.forEach(element => {
            if (element.shadowRoot) {
              const errorElement = element.shadowRoot.querySelector(
                '#input-error-message, [role="alert"]',
              );
              if (errorElement) {
                errorElement.removeAttribute('role');
                errorElement.removeAttribute('aria-live');
              }

              // Remove aria-describedby from all inputs
              const input = element.shadowRoot.querySelector(
                'input, select, textarea, legend',
              );
              if (input && input.hasAttribute('aria-describedby')) {
                input.removeAttribute('aria-describedby');
              }
            }
          });
        };

        if (focusOnAlertRole) {
          // Adding a delay so that the shadow DOM needs to render and attach
          // before we try to focus on the element; without the setTimeout,
          // focus ends up staying on the "Continue" button
          requestAnimationFrame(() => {
            focusElement('[role="alert"]', {}, el?.shadowRoot);
          });
        } else {
          // Remove immediately
          removeAriaDescribedBy();

          // Remove again after component updates
          setTimeout(removeAriaDescribedBy, 50);
          setTimeout(removeAriaDescribedBy, 150);

          // Set up aria-labels on ALL error elements
          const allErrorElements = document.querySelectorAll(selectors);
          allErrorElements.forEach(errorEl => {
            setUpErrorAriaLabel(errorEl);
          });

          // Focus only the FIRST error element
          focusErrorElement(el);
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
