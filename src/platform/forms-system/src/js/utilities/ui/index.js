import Scroll from 'react-scroll';
import { getScrollOptions } from 'platform/utilities/ui';

export const $ = (selectorOrElement, root) =>
  typeof selectorOrElement === 'string'
    ? (root || document).querySelector(selectorOrElement)
    : selectorOrElement;

export const $$ = (selector, root) => [
  ...(root || document).querySelectorAll(selector),
];

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

export const scrollElementName = 'ScrollElement';

// Set focus on target _after_ the content has been updated
export function focusOnChange(name, target = '.edit-btn') {
  setTimeout(() => {
    const el = $(`[name="${name}${scrollElementName}"]`);
    // nextElementSibling = page form
    const focusTarget = el?.nextElementSibling?.querySelector(target);
    if (focusTarget) {
      focusElement(focusTarget);
    }
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

    // We have to search the shadow root of web components that have a slotted va-modal
    const isShadowRootModalOpen = document
      .querySelectorAll('va-omb-info')
      .some(ombInfo =>
        ombInfo.shadowRoot.querySelector(
          'va-modal[visible]:not([visible="false"])',
        ),
      );

    const isModalOpen =
      document.body.classList.contains('modal-open') ||
      document.querySelectorAll('va-modal[visible]:not([visible="false"])') ||
      isShadowRootModalOpen;

    if (!isModalOpen) {
      Scroll.animateScroll.scrollTo(position - 10, getScrollOptions());
    }
    focusElement(errorEl);
  }
}
