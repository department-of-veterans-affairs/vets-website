import Scroll from 'react-scroll';

import { focusElement } from './focus';
import { ERROR_ELEMENTS } from '../constants';

const { scroller } = Scroll;

// Allows smooth scrolling to be overridden by our E2E tests
export function getScrollOptions(additionalOptions) {
  const globals = window.Forms || {};
  const reducedMotion = window?.matchMedia('(prefers-reduced-motion: reduce)')
    ?.matches;
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

// Duplicate of function in platform/forms-system/src/js/utilities/ui/index
export function scrollToFirstError() {
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
    }
    focusElement(errorEl);
  }
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
