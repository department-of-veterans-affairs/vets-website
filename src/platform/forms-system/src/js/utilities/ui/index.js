import Scroll from 'react-scroll';

export const $ = selectorOrElement =>
  typeof selectorOrElement === 'string'
    ? document.querySelector(selectorOrElement)
    : selectorOrElement;

export function focusElement(selectorOrElement, options) {
  const el = $(selectorOrElement);

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

// List from https://html.spec.whatwg.org/dev/dom.html#interactive-content
const focusableElements = [
  '[href]',
  'button',
  'details',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  /* focusable, but not tabbable */
  '[tabindex]:not([tabindex="-1"])',
  /* label removed from list, because you can't programmically focus it
   * unless it has a tabindex of 0 or -1; clicking on it shifts focus to the
   * associated focusable form element
   */
  // 'label[for]',
  /* focusable elements not used in our form system */
  // 'audio[controls]',
  // 'embed',
  // 'iframe',
  // 'img[usemap]',
  // 'object[usemap]',
  // 'video[controls]',
];
/**
 * Find all the focusable elements within a block
 * @param {HTMLElement|node} block - wrapping element
 * @return {HTMLElement[]}
 */
export const getFocusableElements = block =>
  block
    ? [...block?.querySelectorAll(focusableElements.join(','))].filter(
        // Ignore disabled & hidden elements
        // This does not check the element's visibility or opacity
        el => !el.disabled && el.offsetWidth > 0 && el.offsetHeight > 0,
      )
    : [];

const scrollElementName = 'ScrollElement';

// Set focus on target _after_ the content has been updated
export function focusOnChange(name, target = '.edit-btn') {
  setTimeout(() => {
    const selector = `[name="${name}${scrollElementName}"]`;
    const el = document.querySelector(selector);
    // nextElementSibling = page form
    const focusTarget = el?.nextElementSibling?.querySelector(target);
    focusElement(focusTarget);
  });
}

export const scrollToElement = name => {
  if (name) {
    const el =
      typeof name === 'string' && name.includes('name=') ? $(name) : name;
    Scroll.scroller.scrollTo(
      el, // pass a string key + 'ScrollElement' or DOM element
      window.Forms.scroll || {
        duration: 500,
        delay: 2,
        smooth: true,
      },
    );
  }
};

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
  const errorEl = $('.usa-input-error, .input-error-date');
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

/**
 * @typedef FormUtility~findTargetOptions
 * @type {object}
 * @property {boolean} getLabel - if true, return label vs actual element
 */
/**
 * Find the wrapping accordion header, or the label of a specific element inside
 * the accordion
 * @param {Form~errors} error - single error from `form.formErrors.errors`
 * @param {FormUtility~findTargetOptions}
 * @return {HTMLElement} - either the form element or associated label
 */
const findTarget = (error, { getLabel = true } = {}) => {
  // index value indicates an array instance (saved as a string, e.g. '0')
  const propertyKey = `${error.pageKey}${error.index || ''}`;
  const el = $(`[name="${propertyKey}${scrollElementName}"]`);
  if (error.pageKey === error.chapterKey) {
    return el;
  }
  // Find all visible elements within the form
  const form = el?.closest('.form-review-panel-page')?.querySelector('form');
  const formElement = getFocusableElements(form)
    // narrow down search to a matching id (if possible)
    .filter(
      elm =>
        // ID may not match in an array block (e.g. 526 servicePeriods)
        (error.index || '') === '' ? elm.id.includes(`_${error.name}`) : true,
    )?.[0];
  return getLabel
    ? formElement
        ?.closest('.schemaform-field-template')
        ?.querySelector('legend, label')
    : formElement;
};

/**
 * Focus on the review form accordion chapter, or form element; then scroll
 * to that element. Code is within a setTimeout since it is difficult to add a
 * ref or call this function within the componentDidMount function (both within
 * the rjsf library)
 * The error object is created by ../utilities/data/reduceErrors.js
 * @param {Form~errors} error - single error from `form.formErrors.errors`
 */
export const focusAndScrollToReviewElement = (error = {}) => {
  if (error.name) {
    // Ensure DOM updates
    setTimeout(() => {
      const el = findTarget(error);
      if (el) {
        if (error.pageKey === error.chapterKey) {
          // Focus on accordion header (pageKey title is hidden)
          focusElement(el);
          scrollToElement(`chapter${error.chapterKey}${scrollElementName}`);
        } else {
          focusElement(el);
          // label/legend with id OR div before an array (table) wrapper
          scrollToElement(el.id || `topOfTable_${error.name}`);
        }
      }
    });
  }
};
