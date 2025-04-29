import Scroll from 'react-scroll';
import { focusElement } from './focus';
import { ERROR_ELEMENTS } from '../constants';
import { getPageYPosition } from '../scroll';

const { scroller } = Scroll;

/**
 * We're planning on deprecating React scroll library. Please switch to using
 * similarly named functions in platform/utilities/scroll
 */

// Allows smooth scrolling to be overridden by our E2E tests
export function getScrollOptions(additionalOptions) {
  const globals = window.Forms || {};
  const defaults = {
    duration: 500,
    delay: 0,
    smooth: true,
  };
  const reducedMotion = window?.matchMedia('(prefers-reduced-motion: reduce)')
    ?.matches;
  const motionPreference = reducedMotion
    ? {
        duration: 0,
        delay: 0,
        smooth: false,
      }
    : {};

  return {
    ...defaults,
    ...globals.scroll,
    ...additionalOptions,
    ...motionPreference,
  };
}

export function scrollTo(elem, options = getScrollOptions()) {
  scroller.scrollTo(elem, options);
}

export function scrollToTop(position = 0, options = getScrollOptions()) {
  scroller.scrollTo(position, options);
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
 * @param {scrollToFirstErrorOptions} options
 */
export function scrollToFirstError({ focusOnAlertRole = false } = {}) {
  return new Promise(resolve => {
    const selectors = ERROR_ELEMENTS.join(',');
    const timeout = 500;
    const observerConfig = { childList: true, subtree: true };
    const rootEl = document.querySelector('#react-root') || document.body;
    let fallbackTimer;
    let observer;

    const runCleanup = el => {
      // eslint-disable-next-line no-console
      if (!el) console.warn('scrollToFirstError: Error element not found', el);
      clearTimeout(fallbackTimer);
      observer?.disconnect();
      resolve();
    };

    const attemptScrollAndFocus = el => {
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
        const position = el.getBoundingClientRect().top + getPageYPosition();
        Scroll.animateScroll.scrollTo(position - 10, getScrollOptions());

        if (focusOnAlertRole && el.tagName.startsWith('VA-')) {
          focusElement('[role="alert"]', {}, el.shadowRoot);
        } else {
          focusElement(el);
        }
      }

      runCleanup(true);
    };

    const queryForErrors = () => {
      const el = document.querySelector(selectors);
      if (el) attemptScrollAndFocus(el);
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
}

export function scrollAndFocus(errorEl) {
  if (errorEl) {
    const currentPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const position = errorEl.getBoundingClientRect().top + currentPosition;
    Scroll.animateScroll.scrollTo(position - 10, getScrollOptions());
    focusElement(errorEl);
  }
}
