/* eslint-disable no-console */

export function isWebComponent(el) {
  return !!el?.tagName?.includes('VA-');
}

export function isWebComponentReady(el) {
  return !!(el?.shadowRoot && el?.classList.contains('hydrated'));
}

/**
 * Web components initially render as 0 width / 0 height with no
 * shadow dom content, so this waits until it contains a shadowRoot
 * and a class "hydrated" and is visually rendered
 *
 * @param {HTMLElement} hostEl e.g. `document.querySelect('va-segmented-progress-bar')`
 * @param {() => void} callback called once shadow dom is ready
 * @param {boolean} [waitForAnimationFrame] Defaults to true. Whether to callback immediately, or wait until the next paint.
 */
export function awaitShadowRoot(
  hostEl,
  callback,
  waitForAnimationFrame = true,
) {
  if (!hostEl || !(hostEl instanceof HTMLElement)) {
    console.error('Invalid hostEl provided to awaitShadowRoot.');
    return;
  }

  if (process.env.NODE_ENV === 'test') {
    // Skip for unit tests
    // shadowRoot is not properly populated in
    // React testing library, so just callback
    callback();
    return;
  }

  if (hostEl.hasAttribute('data-observing-shadow')) {
    return;
  }
  hostEl.setAttribute('data-observing-shadow', 'true');

  const hostObserver = new MutationObserver(() => {
    try {
      // web component is ready when these are true
      if (hostEl.shadowRoot && hostEl.classList.contains('hydrated')) {
        if (waitForAnimationFrame) {
          // shadowRoot will exist, but its contents may not be
          // visible at this point because it hasn't rerendered
          requestAnimationFrame(() => {
            callback();
          });
        } else {
          callback();
        }
        hostEl.removeAttribute('data-observing-shadow');
        if (hostObserver) {
          hostObserver.disconnect();
        }
      }
    } catch (error) {
      console.error('An error occurred in awaitShadowRoot: ', error);
      hostEl.removeAttribute('data-observing-shadow');
      if (hostObserver) {
        hostObserver.disconnect();
      }
    }
  });

  hostObserver.observe(hostEl, {
    childList: true,
    attributes: true,
    subtree: true,
  });
}
