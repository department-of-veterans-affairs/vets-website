/* eslint-disable no-console */

/**
 * Checks if element has a tagName 'va-'
 * ```
 * const element = document.querySelector('va-text-input')
 * expect(isWebComponent(element).to.eq(true))
 * expect(isWebComponent('va-text-input').to.eq(true))
 * expect(isWebComponent('va-text-input', container).to.eq(true))
 * ```
 * @param {HTMLElement | string} el
 * @param {HTMLElement} [root]
 * @return {boolean}
 */
export function isWebComponent(el, root) {
  const element =
    typeof el === 'string' ? (root || document).querySelector(el) : el;
  return !!element?.tagName?.startsWith('VA-');
}

/**
 * @param {HTMLElement} el an element that may recieve focus
 * @returns {boolean} is the element a form input
 */
export function isNativeFormInput(el) {
  return (
    !!el &&
    ['input', 'select', 'textarea', 'button'].includes(el.tagName.toLowerCase())
  );
}
/**
 * Checks for shadowRoot and "hydrated" class.
 * Doesn't work for unit tests since React testing library doesn't populate shadowRoot
 * ```
 * const element = document.querySelector('va-text-input')
 * expect(isWebComponentReady(element).to.eq(false))
 * expect(isWebComponentReady('va-text-input').to.eq(false))
 * expect(isWebComponentReady('va-text-input', container).to.eq(false))
 * ```
 * @param {HTMLElement | string} el
 * @param {HTMLElement} [root]
 * @return {boolean}
 */
export function isWebComponentReady(el, root) {
  const element =
    typeof el === 'string' ? (root || document).querySelector(el) : el;
  return !!(element?.shadowRoot && element?.classList.contains('hydrated'));
}

/**
 * Web components initially render as 0 width / 0 height with no
 * shadow dom content, so this waits until it contains a shadowRoot
 * and a class "hydrated" and is visually rendered
 *
 * ```
 * // Usage 1:
 * const el = await waitForShadowRoot('va-checkbox-group')
 * console.log("el.shadowRoot now exists")
 * // Usage 2
 * const el = container.querySelector('va-checkbox-group')
 * await waitForShadowRoot(el)
 * console.log("el.shadowRoot now exists")
 * // Usage 3:
 * const el = document.querySelector('va-checkbox-group')
 * waitForShadowRoot(el).then(host => {
 *    console.log("host.shadowRoot now exists")
 * });
 * ```
 * @param {HTMLElement | string} el e.g. `document.querySelect('va-segmented-progress-bar')`
 * @param {boolean} [waitForPaint] Defaults to true. Whether to callback immediately, or wait until the next paint.
 * @return {Promise<hostElement>}
 */
export function waitForShadowRoot(el, waitForPaint = true) {
  return new Promise((resolve, reject) => {
    const host = typeof el === 'string' ? document.querySelector(el) : el;

    if (isWebComponentReady(host) || process.env.NODE_ENV === 'test') {
      // shadowRoot not populated in React testing library so just return
      resolve(host);
      return;
    }

    if (host.hasAttribute('data-observing-shadow')) {
      return;
    }
    host.setAttribute('data-observing-shadow', 'true');

    const hostObserver = new MutationObserver(() => {
      try {
        if (isWebComponentReady(host)) {
          // shadowRoot will exist, but its contents may not be
          // visible at this point because it hasn't rerendered
          if (waitForPaint) {
            requestAnimationFrame(() => {
              resolve(host);
            });
          } else {
            resolve(host);
          }
          host.removeAttribute('data-observing-shadow');
          if (hostObserver) {
            hostObserver.disconnect();
          }
        }
      } catch (error) {
        reject(new Error(`An error occurred in waitForShadowRoot`));
        console.error('An error occurred in waitForShadowRoot: ', error);
        host.removeAttribute('data-observing-shadow');
        if (hostObserver) {
          hostObserver.disconnect();
        }
      }
    });

    hostObserver.observe(host, {
      childList: true,
      attributes: true,
      subtree: true,
    });
  });
}

/**
 * Take a form field and find the underlying native form input for focus
 * @param {HTMLElement} rootElement - the element found from the parent selector
 * @param {string} selector - the list of lower level selectors
 * @returns {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement }
 */
export function findNativeFormInputFocusTarget(rootElement, selector) {
  // we have reached the underlying form element that needs to be focused or else there isn't one to be found
  if (rootElement === null || isNativeFormInput(rootElement)) {
    return rootElement;
  }
  // it's a webcomponent with a shadowRoot
  let _rootElement = rootElement?.shadowRoot?.querySelector(selector);

  // it's either not a webcomponent or it doesn't have a shadowRoot
  if (!_rootElement) {
    _rootElement = rootElement.querySelector(selector);
  }

  // stop infinite recursion if querySelector returns itself
  if (_rootElement === rootElement) {
    return rootElement;
  }

  return findNativeFormInputFocusTarget(_rootElement, selector);
}

/**
 * An async querySelector that waits for all necessary shadowRoots involved
 *
 * ```
 * // Example with await:
 * const el = await querySelectorWithShadowRoot('va-checkbox#id-1')
 * const el = await querySelectorWithShadowRoot('va-checkbox#id-1', 'va-checkbox-group')
 * const el = await querySelectorWithShadowRoot('va-checkbox#id-1', container)
 * console.log(el.shadowRoot)
 *
 * // Example with then:
 * querySelectorWithShadowRoot('va-checkbox#id-1')
 *    .then(el => console.log(el.shadowRoot))
 * querySelectorWithShadowRoot('va-checkbox#id-1', 'va-checkbox-group')
 *    .then(el => console.log(el.shadowRoot))
 * querySelectorWithShadowRoot('va-checkbox#id-1', container)
 *    .then(el => console.log(el.shadowRoot))
 * ```
 *
 * @param {string | HTMLElement} selector
 * @param {string | HTMLElement} [root]
 * @returns {Promise<HTMLElement | null>}
 */
export async function querySelectorWithShadowRoot(
  selector,
  root,
  { focusNativeFormInput } = {},
) {
  try {
    let selectorElement;
    const rootElement =
      typeof root === 'string'
        ? document.querySelector(root)
        : root || document;

    if (isWebComponent(rootElement) && !isWebComponentReady(rootElement)) {
      const waitForPaint = false;
      // we need to wait for this despite a child being in
      // light dom or shadow dom, because async rendering
      await waitForShadowRoot(rootElement, waitForPaint);
    }

    if (typeof selector === 'string') {
      // check light dom first (outside of shadowRoot)
      // (e.g. slot="something" will appear in light dom)
      const lightDomEl = rootElement.querySelector(selector);

      if (focusNativeFormInput) {
        // we need to keep drilling down for a standard form input
        selectorElement =
          (isWebComponent(lightDomEl) || lightDomEl === null) &&
          rootElement.shadowRoot
            ? (selectorElement = findNativeFormInputFocusTarget(
                rootElement,
                selector,
              ))
            : lightDomEl;
      } else {
        selectorElement = lightDomEl;
        // check shadow dom if not in light dom
        if (!lightDomEl && rootElement.shadowRoot) {
          selectorElement = rootElement.shadowRoot.querySelector(selector);
        }
      }
    } else {
      selectorElement = selector;
    }

    if (
      selectorElement &&
      isWebComponent(selectorElement) &&
      !isWebComponentReady(selectorElement)
    ) {
      const waitForPaint = true;
      await waitForShadowRoot(selectorElement, waitForPaint);
    }

    return selectorElement; // Returns a promise, since this is an async function
  } catch (error) {
    console.error('Error in querySelectorWithShadowRoot:', error);
    return null;
  }
}
