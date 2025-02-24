import Scroll from 'react-scroll';

import { focusElement } from './focus';
import { ERROR_ELEMENTS } from '../constants';

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
  setTimeout(() => {
    // [error] will focus any web-components with an error message
    const errorEl = document.querySelector(ERROR_ELEMENTS.join(','));
    if (errorEl) {
      // document.body.scrollTop doesn’t work with all browsers, so we’ll cover them all like so:
      const currentPosition =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      const position = errorEl.getBoundingClientRect().top + currentPosition;
      // Don't animate the scrolling if there is an open modal on the page. This
      // prevents the page behind the modal from scrolling if there is an error in
      // modal's form.

      // We have to search the shadow root of web components that have a slotted va-modal
      const isShadowRootModalOpen = Array.from(
        document.querySelectorAll('va-omb-info'),
      ).some(ombInfo =>
        ombInfo.shadowRoot?.querySelector(
          'va-modal[visible]:not([visible="false"])',
        ),
      );

      const isModalOpen =
        document.body.classList.contains('modal-open') ||
        document.querySelector('va-modal[visible]:not([visible="false"])') ||
        isShadowRootModalOpen;

      if (!isModalOpen) {
        Scroll.animateScroll.scrollTo(position - 10, getScrollOptions());

        if (focusOnAlertRole && errorEl.tagName.startsWith('VA-')) {
          focusElement('[role="alert"]', {}, errorEl.shadowRoot);
        } else {
          focusElement(errorEl);
        }
      }
    } else {
      // eslint-disable-next-line no-console
      console.error('scrollToFirstError: No error found');
    }
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
