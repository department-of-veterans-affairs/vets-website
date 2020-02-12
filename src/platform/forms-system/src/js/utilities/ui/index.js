import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports
import Scroll from 'react-scroll';

const scrollElementSelector = key => `[name="${key}ScrollElement"]`;

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
  scrollToElement(scrollElementSelector(key));
};

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

export function focusOnFirstElementLabel(
  block,
  { focusOptions = {}, filterCallback },
) {
  let target;
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
    target = els[0]
      ?.closest('.schemaform-field-template')
      ?.querySelector('legend, label');
    // eslint-disable-next-line no-unused-expressions
    target?.focus(focusOptions);
  }
  return target;
}

// Called after the user edits a review form; focus on the review-row containing
// the change (screenreader)
export function focusOnChange(key) {
  // Give DOM time to update
  setTimeout(() => {
    const el = document.querySelector(scrollElementSelector(key));
    const target = el?.nextElementSibling?.querySelector('.review-row');
    if (target) {
      focusElement(target);
    }
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

// error object created by ../utilities/data/reduceErrors.js
export const focusAndScrollToReviewElement = (error = {}) => {
  if (error.name) {
    // Ensure DOM updates
    setTimeout(() => {
      const el = document.querySelector(scrollElementSelector(error.page));
      if (el) {
        if (error.page === error.chapter) {
          // Focus on accordion header
          el.focus();
          scrollToScrollElement(`chapter${error.chapter}`);
        } else {
          // Focus on form element
          const target = focusOnFirstElementLabel(
            el.closest('.form-review-panel-page')?.querySelector('form'),
            { filterCallback: elm => elm.id.includes(`_${error.name}`) },
          );
          scrollToElement(target?.id);
        }
      }
    });
  }
};
