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

// Selectors and constants for error handling
const ERROR_ATTR_SELECTORS = ['error', 'input-error', 'checkbox-error'];
const INPUT_SELECTOR = 'input, select, textarea';
const ERROR_SPAN_SELECTOR = 'span.usa-sr-only[id^="error-label-"]';

/**
 * Get error message text from a web component
 * @param {Element} el - The web component element
 * @returns {string} The error message text
 */
const getErrorPropText = el => {
  for (const attr of ERROR_ATTR_SELECTORS) {
    const msg = el.getAttribute(attr);
    if (msg) return msg;
  }
  return el.error || '';
};

/**
 * Collect all error elements including nested ones within shadow DOMs
 * @param {string} selectors - CSS selectors for error elements
 * @returns {Array<Element>} Array of all error elements (top-level and nested)
 */
const collectAllErrorElements = selectors => {
  const allErrorElements = document.querySelectorAll(selectors);
  const nestedErrorElements = [];

  allErrorElements.forEach(el => {
    const nestedErrors = Array.from(
      el.shadowRoot?.querySelectorAll('*') || [],
    ).filter(child => getErrorPropText(child));

    if (nestedErrors.length) {
      nestedErrorElements.push(...nestedErrors);
    }
  });

  return [...allErrorElements, ...nestedErrorElements];
};

/**
 * Remove alert role from error element to prevent interference
 * @param {Element} el - The element to update
 */
const removeAlertRole = el => {
  const errorElement = el?.shadowRoot?.querySelector(
    '[role="alert"], #input-error-message, #radio-error-message',
  );
  if (errorElement) {
    errorElement.removeAttribute('role');
    errorElement.removeAttribute('aria-live');
  }
};

/**
 * Get label text from a web component
 * @param {Element} el - The web component element
 * @returns {string} The label text
 */
const getLabelText = el => {
  // Try to get from label prop first
  let labelText = el.getAttribute('label') || el.label || '';

  // Try input-label prop if label is empty
  if (!labelText) {
    labelText = el.getAttribute('input-label') || el.inputLabel || '';
  }

  // Fall back to extracting from label element in shadow DOM
  if (!labelText) {
    const labelElement = el.shadowRoot?.querySelector('label');
    labelText = labelElement?.textContent?.trim() || '';
  }

  return labelText;
};

/**
 * Find the focusable element within an error component
 * Searches through nested shadow DOMs and falls back to fieldset if needed
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

  // 4. Fallback: focus fieldset if no inputs found (for radio/checkbox groups)
  if (!focusTarget) {
    const fieldset = el?.shadowRoot?.querySelector('fieldset');
    if (fieldset) {
      fieldset.setAttribute('tabindex', '-1');
      focusTarget = fieldset;
    }
  }

  return focusTarget;
};

/**
 * Associate error message with input element using aria-labelledby
 * @param {Element} errorWebComponent - The web component with an error
 * @param {string} errorMessage - The error message text
 */
const associateErrorWithInput = (errorWebComponent, errorMessage) => {
  const inputElement = findFocusTarget(errorWebComponent);
  if (!inputElement) return;

  const existingLabelId = inputElement.getAttribute('aria-labelledby');
  if (
    existingLabelId &&
    errorWebComponent.shadowRoot?.querySelector(`#${existingLabelId}`)
  )
    return;

  const labelId = `error-label-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const errorText = errorMessage.replace(/^Error\\s*/i, '').trim();
  const labelText = getLabelText(errorWebComponent);
  const fullText = labelText
    ? `Error: ${errorText}. ${labelText}.`
    : `Error: ${errorText}.`;

  const labelSpan = document.createElement('span');
  labelSpan.id = labelId;
  labelSpan.className = 'usa-sr-only';
  labelSpan.textContent = fullText;

  if (errorWebComponent.shadowRoot) {
    errorWebComponent.shadowRoot.appendChild(labelSpan);
  }

  inputElement.setAttribute('aria-labelledby', labelId);
  inputElement.removeAttribute('aria-describedby');
};

/**
 * Remove error annotations from an element's shadow root
 * @param {Element} el - The element to clean
 */
const removeErrorAnnotations = el => {
  if (!el?.shadowRoot) return;

  // Remove aria-labelledby error spans
  el.shadowRoot
    .querySelectorAll(ERROR_SPAN_SELECTOR)
    .forEach(span => span.remove());

  // Remove aria-labelledby from inputs
  el.shadowRoot.querySelectorAll(INPUT_SELECTOR).forEach(input => {
    input.removeAttribute('aria-labelledby');
  });
};

/**
 * Process a single error element to set up accessibility annotations
 * Adds aria-labelledby with sr-only error span
 * @param {Element} errorWebComponent - The web component with an error
 */
const processErrorElement = errorWebComponent => {
  removeAlertRole(errorWebComponent);

  const errorMessage = getErrorPropText(errorWebComponent);
  if (!errorMessage) return;

  // Use aria-labelledby with sr-only span for all components
  associateErrorWithInput(errorWebComponent, errorMessage);
};

/**
 * Recursively clean up error annotations in nested shadow DOMs
 * @param {Element|ShadowRoot} root - The element or shadow root to search
 */
const cleanupNestedShadowRoots = root => {
  if (!root) return;

  // For ShadowRoot, we need to access children via getElementById or other methods
  // For Element, we can use querySelectorAll
  let elements = [];

  if (root.querySelectorAll) {
    elements = Array.from(root.querySelectorAll('*'));
  }

  elements.forEach(el => {
    // Check if this element has a shadow root
    if (el.shadowRoot) {
      // Check if this element has error spans
      if (el.shadowRoot.querySelector(ERROR_SPAN_SELECTOR)) {
        const errorMessage = getErrorPropText(el);
        if (!errorMessage) {
          removeErrorAnnotations(el);
        }
      }
      // Recursively check nested shadow roots
      cleanupNestedShadowRoots(el.shadowRoot);
    }
  });
};

/**
 * Clean up error annotations from web components that no longer have errors
 */
export const cleanupErrorAnnotations = () => {
  // Find all elements that currently have error attributes
  const errorSelector = ERROR_ATTR_SELECTORS.map(attr => `[${attr}]`).join(
    ', ',
  );
  const elementsWithErrors = document.querySelectorAll(errorSelector);
  elementsWithErrors.forEach(el => {
    const errorMessage = getErrorPropText(el);
    if (!errorMessage) {
      removeErrorAnnotations(el);
    }
  });

  // Recursively clean up all nested shadow DOMs
  cleanupNestedShadowRoots(document);
};

// Set up a MutationObserver to clean up errors when attributes change
if (typeof window !== 'undefined') {
  const observerConfig = {
    attributes: true,
    attributeFilter: ERROR_ATTR_SELECTORS,
    subtree: true,
  };

  const startObserving = () => {
    // Debounce cleanup to avoid excessive calls
    let cleanupTimeout;
    const debouncedCleanup = () => {
      clearTimeout(cleanupTimeout);
      cleanupTimeout = setTimeout(cleanupErrorAnnotations, 50);
    };

    const observer = new MutationObserver(debouncedCleanup);
    observer.observe(document, observerConfig);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserving);
  } else {
    startObserving();
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
    const { errorContext } = options;
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

        // Clean up orphaned error annotations from nested shadow DOMs
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
