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
  // Find all web components that might have legends or labels with sr-only error spans
  const allComponents = document.querySelectorAll(
    'va-radio, va-checkbox, va-checkbox-group, va-memorable-date, va-statement-of-truth',
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

      // Also check labels (for va-checkbox)
      const label = component.shadowRoot?.querySelector('label');
      if (label) {
        const errorSpan = label.querySelector('.sr-only-error');
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
        attributeFilter: ['error', 'input-error', 'checkbox-error'],
        subtree: true,
      });
    });
  } else {
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['error', 'input-error', 'checkbox-error'],
      subtree: true,
    });
  }
}

/**
 * Collect all error elements including nested ones within shadow DOMs
 * @param {string} selectors - CSS selectors for error elements
 * @returns {Array<Element>} Array of all error elements (top-level and nested)
 */
const collectAllErrorElements = selectors => {
  const allErrorElements = document.querySelectorAll(selectors);
  const nestedErrorElements = [];

  allErrorElements.forEach(el => {
    const nestedErrors = el.shadowRoot?.querySelectorAll(
      '[error]:not([error=""])',
    );
    if (nestedErrors) {
      nestedErrorElements.push(...Array.from(nestedErrors));
    }
  });

  return [...allErrorElements, ...nestedErrorElements];
};

/**
 * Add sr-only error text to a label or legend element for screen reader accessibility
 * @param {Element} errorWebComponent - The web component with an error
 * @param {string} errorMessage - The error message text to add
 * @param {string} targetSelector - CSS selector for the target element ('legend' or 'label')
 */
const addSROnlyErrorToElement = (
  errorWebComponent,
  errorMessage,
  targetSelector = 'legend',
) => {
  const targetElement = errorWebComponent.shadowRoot?.querySelector(
    targetSelector,
  );

  if (
    errorMessage &&
    targetElement &&
    !targetElement.querySelector('.sr-only-error')
  ) {
    const errorText = errorMessage.replace(/^Error\s*/i, '').trim();
    const errorSpan = document.createElement('span');
    errorSpan.className = 'usa-sr-only sr-only-error';
    errorSpan.textContent = `Error: ${errorText}. `;
    targetElement.insertBefore(errorSpan, targetElement.firstChild);
  }
};

/**
 * Associate error message with input element using aria-describedby
 * @param {Element} errorWebComponent - The web component with an error
 * @param {string} errorId - The ID of the error message element
 */
const associateErrorWithInput = (errorWebComponent, errorId) => {
  const inputElement = errorWebComponent?.shadowRoot?.querySelector(
    'input, select, textarea',
  );

  if (inputElement) {
    const existingDescribedBy = inputElement.getAttribute('aria-describedby');
    if (!existingDescribedBy) {
      // No existing aria-describedby, just set the error ID
      inputElement.setAttribute('aria-describedby', errorId);
    } else if (!existingDescribedBy.includes(errorId)) {
      // Error ID not present, add it first
      inputElement.setAttribute(
        'aria-describedby',
        `${errorId} ${existingDescribedBy}`,
      );
    } else if (!existingDescribedBy.startsWith(errorId)) {
      // Error ID present but not first, reorder it
      const ids = existingDescribedBy.split(' ').filter(id => id !== errorId);
      inputElement.setAttribute(
        'aria-describedby',
        `${errorId} ${ids.join(' ')}`,
      );
    }
  }
};

/**
 * Process a single error element to set up accessibility annotations
 * Adds aria-describedby for inputs or sr-only text for legends
 * @param {Element} errorWebComponent - The web component with an error
 */
const processErrorElement = errorWebComponent => {
  const errorElement = errorWebComponent?.shadowRoot?.querySelector(
    '[role="alert"], #input-error-message, #radio-error-message',
  );

  if (!errorElement) return;

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

  // Special handling for va-checkbox: add error to label instead of using aria-describedby
  const isCheckbox = errorWebComponent.tagName === 'VA-CHECKBOX';
  if (isCheckbox) {
    const errorMessage =
      errorWebComponent.getAttribute('error') || errorWebComponent.error;
    addSROnlyErrorToElement(errorWebComponent, errorMessage, 'label');

    // Remove aria-describedby from checkbox input to prevent duplicate announcements
    const checkboxInput = errorWebComponent?.shadowRoot?.querySelector(
      'input[type="checkbox"]',
    );
    if (checkboxInput) {
      checkboxInput.removeAttribute('aria-describedby');
    }
    return;
  }

  // Check if there's a focusable input element (including nested shadow DOMs)
  const hasInput = hasInputInShadowDOM(errorWebComponent);

  if (!hasInput) {
    // No input found - add sr-only error to legend for components like radio/checkbox groups
    const errorMessage =
      errorWebComponent.getAttribute('error') ||
      errorWebComponent.getAttribute('input-error') ||
      errorWebComponent.getAttribute('checkbox-error') ||
      errorWebComponent.error;
    addSROnlyErrorToElement(errorWebComponent, errorMessage);
  } else {
    // For other inputs, use aria-describedby
    associateErrorWithInput(errorWebComponent, errorId);
  }
};

/**
 * Find the focusable element within an error component
 * Searches through nested shadow DOMs and falls back to legend if needed
 * @param {Element} el - The error element to search within
 * @returns {Element|null} The focusable element, or null if none found
 */
const findFocusTarget = el => {
  let focusTarget;

  // 1. First check if there's a child component with an error (for nested web components)
  let childWithError = null;
  if (el?.shadowRoot) {
    childWithError = Array.from(el.shadowRoot.children).find(
      child =>
        child.hasAttribute('error') && child.getAttribute('error') !== '',
    );
  }
  if (childWithError) {
    focusTarget = childWithError.shadowRoot?.querySelector(
      'input, select, textarea',
    );
  }

  // 2. If not found, try direct input at current level
  if (!focusTarget) {
    focusTarget = el?.shadowRoot?.querySelector('input, select, textarea');
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

  return focusTarget;
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
    const { focusOnAlertRole = true, errorContext } = options;
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

          // Collect and process all error elements (including nested ones)
          const allErrors = collectAllErrorElements(selectors);
          allErrors.forEach(processErrorElement);

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
