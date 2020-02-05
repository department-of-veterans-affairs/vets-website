import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports
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

export function focusOnFirstElement(
  block,
  { focusOptions = {}, filterCallback },
) {
  if (block) {
    // List from https://html.spec.whatwg.org/dev/dom.html#interactive-content
    const focusableElements = [
      '[href]',
      'button',
      'details',
      'input:not([type="hidden"])',
      // 'label[for]', some form labels
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])', // focusable, but not tabbable
      // focusable elements not used in our form system
      // 'audio[controls]',
      // 'embed',
      // 'iframe',
      // 'img[usemap]',
      // 'object[usemap]',
      // 'video[controls]',
    ];
    let els = [...block?.querySelectorAll(focusableElements.join(','))].filter(
      // Ignore disabled & hidden elements
      // This does not check the elements visibility or opacity
      el => !el.disabled && el.offsetWidth > 0 && el.offsetHeight > 0,
    );
    if (typeof filterCallback === 'function') {
      els = els.filter(filterCallback);
    }
    // eslint-disable-next-line no-unused-expressions
    els[0]?.focus(focusOptions);
  }
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
  return _.merge({}, defaults, globals.scroll, additionalOptions);
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

export const scrollToElement = name => {
  if (name) {
    Scroll.scroller.scrollTo(
      name,
      window.Forms.scroll || {
        duration: 500,
        delay: 2,
        smooth: true,
      },
    );
  }
};

export const scrollToScrollElement = key => {
  scrollToElement(`${key}ScrollElement`);
};

// error object created by ../utilities/data/formatErrors.js
export const focusAndScrollToReviewElement = (error = {}) => {
  if (error.name) {
    // Ensure DOM updates
    setTimeout(() => {
      // accordion uses a 1-based index
      const selector = `[name="${error.page}ScrollElement"]`;
      const el = document.querySelector(selector);
      if (el) {
        if (error.page === error.chapter) {
          // Focus on accordion header
          el.focus();
          scrollToScrollElement(`chapter${error.chapter}`);
        } else {
          // Focus on form element
          focusOnFirstElement(
            el.closest('.form-review-panel-page')?.querySelector('form'),
            { filterCallback: elm => elm.id.includes(`_${error.name}`) },
          );
          scrollToElement(el.id);
        }
      }
    });
  }
};
