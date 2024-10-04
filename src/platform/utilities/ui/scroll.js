import Scroll from 'react-scroll';

import { focusElement } from './focus';
import { ERROR_ELEMENTS } from '../constants';

const { scroller } = Scroll;

/**
 * Checks for reduce motion preference
 * @returns {Boolean}
 */
export const hasReducedMotion = () =>
  window?.matchMedia('(prefers-reduced-motion: reduce)')?.matches;

/**
 * Returns targeted element top position, or if not found returns current
 * document scroll position
 * @param {String|Element} el - element to find top position of
 * @param {Number} offset - any vertical offset to include in calculation
 * @returns {Number}
 */
export const getElementTopPosition = (el, offset = 0) => {
  const target =
    typeof el === 'string'
      ? document.querySelector('main').querySelector(el) // el inside <main>
      : el;
  const currentPosition =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;
  return target
    ? target.getBoundingClientRect().top + currentPosition - offset
    : currentPosition;
};

// Allows smooth scrolling to be overridden by our E2E tests
export function getScrollOptions(additionalOptions) {
  const globals = window.Forms || {};
  const reducedMotion = hasReducedMotion();
  const defaults = {
    duration: reducedMotion ? 0 : 500,
    delay: 0,
    smooth: !reducedMotion,
  };
  return { ...defaults, ...globals.scroll, ...additionalOptions };
}

export function scrollTo(elem, options = getScrollOptions()) {
  scroller.scrollTo(elem, options);
}

export function scrollToTop(position = 0, options = getScrollOptions()) {
  scroller.scrollTo(position, options);
}

/**
 * Scroll an element into view (not using react-scroll)
 * @param {String|Element} el - element to scroll to
 * @param {Number} offset=0 - any vertical offset
 */
export function windowScrollToElement(el, offset = 0) {
  window.scrollTo({
    top: getElementTopPosition(el, offset),
    left: 0,
    behavior: hasReducedMotion() ? 'instant' : 'smooth',
  });
}

// Duplicate of function in platform/forms-system/src/js/utilities/ui/index
/**
 * Scroll to first error on the page (using react-scroll)
 * @param {Number} offset=0 - any vertical offset
 */
export function scrollToFirstError(offset) {
  // [error] will focus any web-components with an error message
  const errorEl = document.querySelector(ERROR_ELEMENTS.join(','));
  if (errorEl) {
    const position = getElementTopPosition(errorEl, offset);
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
    }
    if (errorEl.tagName.startsWith('VA-')) {
      focusElement('[role="alert"]', {}, errorEl);
    } else {
      focusElement(errorEl);
    }
  }
}

export function scrollAndFocus(errorEl, offset) {
  if (errorEl) {
    const position = getElementTopPosition(errorEl, offset);
    Scroll.animateScroll.scrollTo(position - 10, getScrollOptions());
    focusElement(errorEl);
  }
}
