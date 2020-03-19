import Scroll from 'react-scroll';

export function focusElement(selectorOrElement, options) {
  const el =
    typeof selectorOrElement === 'string'
      ? document.querySelector(selectorOrElement)
      : selectorOrElement;

  if (el) {
    if (el.tabIndex === 0) {
      el.setAttribute('tabindex', '0');
    }
    if (el.tabIndex < 0) {
      el.setAttribute('tabindex', '-1');
    }
    el.focus(options);
  }
}

// Set focus on target _after_ the content has been updated
export function focusOnChange(name, target = '.edit-btn') {
  setTimeout(() => {
    const selector = `[name="${name}ScrollElement"]`;
    const el = document.querySelector(selector);
    // nextElementSibling = page form
    const focusTarget = el?.nextElementSibling?.querySelector(target);
    focusElement(focusTarget);
  });
}

export function setGlobalScroll() {
  window.Forms = window.Forms || {
    scroll: {
      duration: 500,
      delay: 0,
      smooth: true,
    },
  };
}

// Allows smooth scrolling to be overridden by our E2E tests
export function getScrollOptions(additionalOptions) {
  const globals = window.Forms || {};
  const defaults = {
    duration: 500,
    delay: 0,
    smooth: true,
  };
  return Object.assign({}, defaults, globals.scroll, additionalOptions);
}

export function scrollToFirstError() {
  const errorEl = document.querySelector('.usa-input-error, .input-error-date');
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
    if (!document.body.classList.contains('modal-open')) {
      Scroll.animateScroll.scrollTo(position - 10, getScrollOptions());
    }
    focusElement(errorEl);
  }
}
