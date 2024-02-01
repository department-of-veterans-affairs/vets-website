/* eslint-disable no-console */
import {
  isInShadowDOM,
  isWebComponent,
  querySelectorWithShadowRoot,
} from './webComponents';

/** defaultFocusSelector
 * Selector string for both pre-v3 and v3 va-segmented-progress-bar's H2
 * Both H2s include "Step {index} of {total}: {page title}"
 * NOTE: For v3 (uswds) (web-component) bar, pass its shadowRoot as root param to the focus methods.  [See FormNav.jsx.]
 */
export const defaultFocusSelector =
  // #nav-form-header is pre-v3-bar's H2
  // .usa-step-indicator__heading is v3-bar's H2
  // TODO: Remove pre-v3 selector, after DST defaults all components to v3 [~2024-02-17].
  '#nav-form-header, .usa-step-indicator__heading';
// '.nav-header > h2, va-segmented-progress-bar[uswds][heading-text][header-level="2"]';

/**
 * Focus on element
 * @param {String|Element} selectorOrElement - CSS selector or attached DOM
 *  element
 * @param {FocusOptions} options - "preventScroll" or "focusVisible". See
 *  https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#parameters
 * @param {Element} root - root element for querySelector; would allow focusing
 *  on elements inside of shadow dom
 */
export async function focusElement(selectorOrElement, options, root) {
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
      if (isInShadowDOM(el)) {
        // Safari doesn't dispatch focus events on shadow-DOM elements,
        // so we manually dispath it to ensure screen readers are aware.
        console.info(
          '[focus.focusElement] Dispatching focus event from shadow-DOM element',
        );
        el.dispatchEvent(new FocusEvent('focus'));
      }
    }
  }

  if (isWebComponent(root) || isWebComponent(selectorOrElement, root)) {
    const elWithShadowRoot = await querySelectorWithShadowRoot(
      selectorOrElement,
      root,
    );
    applyFocus(elWithShadowRoot); // synchronous code
  } else {
    const el =
      typeof selectorOrElement === 'string'
        ? (root || document).querySelector(selectorOrElement)
        : selectorOrElement;
    applyFocus(el); // synchronous code
  }
}

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
  timeInterval = 250,
  // added because we first need to wait for a component to be rendered, then we
  // need to target an element inside the component (in regular or in a web
  // component's shadow DOM)
  internalSelector,
) {
  const maxIterations = 6; // 1.5 seconds
  let count = 0;

  const interval = setInterval(() => {
    const el = (root || document).querySelector(selector);
    if (el) {
      clearInterval(interval);
      if (internalSelector) {
        focusElement(internalSelector, {}, el);
      } else {
        focusElement(el);
      }
    } else if (count >= maxIterations) {
      clearInterval(interval);
      focusElement(defaultFocusSelector); // fallback to breadcrumbs
    }
    count += 1;
  }, timeInterval);
}

/**
 * Focus on first found element within the list; we're ignoreing DOM order, i.e.
 * using focusElement('h3, h2') will always focus on the h2 (higher on the page)
 * @param {String|Array} selectors - selectors in the desired order; if the
 *  first selector has no target, it'll move to the second, etc.
 * @param {Element} root - starting element of the querySelector; may be a
 *  shadowRoot
 * @example focusByOrder('#main h3, .nav-header > h2');
 * @example focusByOrder(['#main h3', '.nav-header > h2']);
 */
export function focusByOrder(selectors, root) {
  let list = selectors || '';
  if (typeof selectors === 'string') {
    list = selectors.split(',');
  }
  if (Array.isArray(list)) {
    list.some(selector => {
      const el = (root || document).querySelector((selector || '').trim());
      if (el) {
        focusElement(el, {}, root);
        return true;
      }
      return false;
    });
  }
}
