import { isWebComponent, querySelectorWithShadowRoot } from './webComponents';

import environment from '../environment';

// This is a custom string delimiter (not valid CSS) to indicate that part of the selector
// is targeting an element inside a web component's shadow DOM
const SHADOW_DELIMITER = '>>shadow>>';

// .nav-header > h2 contains "Step {index} of {total}: {page title}"
// For va-segmented-progress-bar, target h2 inside shadow root using custom >>shadow>> delimiter
export const defaultFocusSelector =
  'va-segmented-progress-bar>>shadow>>h2, .nav-header > h2';

/**
 * @typedef FocusOptions
 * @description https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#parameters
 * @type {Object}
 * @property {Boolean} preventScroll - if true, no scrolling will occur
 * @property {Boolean} focusVisible - experimental: if true it will force a
 *  visible focus indicator to be seen
 */
/**
 * Focus on element
 * @param {String|Element} selectorOrElement - CSS selector or attached DOM element.
 * @param {FocusOptions} [options]
 * @param {Element} [root] - root element for querySelector; would allow focusing
 *  on elements inside of shadow dom
 */
export function focusElement(selectorOrElement, options = {}, root) {
  function applyFocus(el) {
    if (el) {
      // Use getAttribute to grab the "tabindex" attribute (returns string), not
      // the "tabIndex" property (returns number). Focusable elements will
      // automatically have a tabIndex of zero, otherwise it's -1.
      const tabindex = el.getAttribute('tabindex');
      // No need to add, or remove a tabindex="0"
      if (el.tabIndex !== 0) {
        el.setAttribute('tabindex', '-1');
        if (typeof tabindex === 'undefined' || tabindex === null) {
          // Remove tabindex on blur. If a web-component is focused using a -1
          // tabindex and is not removed on blur, the shadow elements inside will
          // not be focusable
          el.addEventListener(
            'blur',
            () => {
              el.removeAttribute('tabindex');
            },
            { once: true },
          );
        }
      }

      el.focus(options);
    }
  }

  if (isWebComponent(root) || isWebComponent(selectorOrElement, root)) {
    querySelectorWithShadowRoot(selectorOrElement, root).then(
      elWithShadowRoot => applyFocus(elWithShadowRoot), // async code
    );
  } else {
    const el =
      typeof selectorOrElement === 'string'
        ? (root || document).querySelector(selectorOrElement)
        : selectorOrElement;
    applyFocus(el); // synchronous code
  }
}

/**
 * Focus on first found element within the list
 * @param {String|Array} selectors - selectors in priority order; tries each until one is found.
 * @param {Element} root - starting element of the querySelector
 * @example focusByOrder('#main h3, .nav-header > h2');
 * @example focusByOrder(['#main h3', '.nav-header > h2']);
 * @example focusByOrder('va-radio>>shadow>>h3, .nav-header > h2');
 */
export function focusByOrder(selectors, root) {
  let list = selectors || '';
  if (typeof selectors === 'string') {
    list = selectors.split(',');
  }
  if (Array.isArray(list)) {
    list = list.flatMap(
      selector =>
        typeof selector === 'string' ? selector.split(',') : selector,
    );

    list.some(selector => {
      const trimmedSelector = (selector || '').trim();
      if (!trimmedSelector) {
        return false;
      }

      // Handle selectors in the shadow root
      if (trimmedSelector.includes(SHADOW_DELIMITER)) {
        const [hostSelector, internalSelector] = trimmedSelector.split(
          SHADOW_DELIMITER,
        );
        const host = (root || document).querySelector(hostSelector.trim());
        if (host && host.shadowRoot) {
          const shadowEl = host.shadowRoot.querySelector(
            internalSelector.trim(),
          );
          if (shadowEl) {
            focusElement(shadowEl);
            return true;
          }
          setTimeout(() => {
            if (document.activeElement === document.body) {
              const el = host.shadowRoot.querySelector(internalSelector.trim());
              if (el) {
                focusElement(el);
              }
            }
          }, 100);
          return true;
        }
        return false;
      }

      // Handle regular selectors
      const el = (root || document).querySelector(trimmedSelector);
      if (el) {
        focusElement(el, {}, root);
        return true;
      }
      return false;
    });
  }
}

const noAsyncFocusWhenCypressRunningInCiOrLocally =
  typeof Cypress !== 'undefined' &&
  (Cypress.env('CI') || environment.isLocalhost());
const defaultTime = noAsyncFocusWhenCypressRunningInCiOrLocally ? 0 : 250;

export const waitTime = (time = 250) =>
  noAsyncFocusWhenCypressRunningInCiOrLocally ? 0 : time;

/**
 * Web components may not have their shadow DOM rendered right away, so we need
 * to wait & check before setting focus on the selector; if not found after max
 * iterations, then fall back to the default selector (step _ of _ h2)
 * Discussion: https://dsva.slack.com/archives/CBU0KDSB1/p1676479946812439
 * @param {String} selector - focus target selector
 * @param {Element} root - starting element of the querySelector
 * @param {Number} timeInterval - time in milliseconds to delay
 * @param {String} internalSelector - selector pointing to an element inside the
 *  component we're waiting for (could be an element in shadow DOM)
 * @example waitForRenderThenFocus('h3', document.querySelector('va-radio').shadowRoot);
 */
export function waitForRenderThenFocus(
  selector,
  root = document,
  timeInterval = defaultTime,
  // added because we first need to wait for a component to be rendered, then we
  // need to target an element inside the component (in regular or in a web
  // component's shadow DOM)
  internalSelector,
) {
  const maxIterations = 6; // 6 iterations * 250 ms = 1.5 seconds
  let count = 0;

  if (!timeInterval) {
    focusByOrder([selector, defaultFocusSelector]);
  } else {
    let interval = setInterval(() => {
      const effectiveRoot = root || document;
      // Guard against root becoming undefined after component unmount
      if (!effectiveRoot || typeof effectiveRoot.querySelector !== 'function') {
        clearInterval(interval);
        interval = null;
        return;
      }
      const el = effectiveRoot.querySelector(selector);
      if (el) {
        clearInterval(interval);
        interval = null;
        if (internalSelector) {
          focusElement(internalSelector, {}, el);
        } else {
          focusElement(el);
        }
      } else if (interval && count >= maxIterations) {
        clearInterval(interval);
        interval = null;

        // Don't set default focus if something is already focused
        if (document.activeElement === document.body) {
          focusByOrder(defaultFocusSelector); // fallback to breadcrumbs
        }
      }
      count += 1;
    }, timeInterval);
  }
}
