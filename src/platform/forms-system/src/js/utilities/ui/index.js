import Scroll from 'react-scroll';
import {
  focusElement,
  focusByOrder,
  getScrollOptions,
} from 'platform/utilities/ui';
import { webComponentList } from 'platform/forms-system/src/js/web-component-fields/webComponentList';

export const $ = (selectorOrElement, root) =>
  typeof selectorOrElement === 'string'
    ? (root || document).querySelector(selectorOrElement)
    : selectorOrElement;

export const $$ = (selector, root) => [
  ...(root || document).querySelectorAll(selector),
];

export { focusElement, focusByOrder };

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
export const getFocusableElements = block => {
  let elements = [];

  if (block) {
    elements = [
      ...block.querySelectorAll(
        [...focusableElements, ...webComponentList].join(','),
      ),
    ]
      .map(el => {
        if (el.shadowRoot) {
          return getFocusableElements(el.shadowRoot);
        }
        return el;
      })
      .flat()
      .filter(
        // Ignore disabled & hidden elements
        // This does not check the element's visibility or opacity
        el => !el.disabled && el.offsetWidth > 0 && el.offsetHeight > 0,
      );
  }

  return elements;
};

export const scrollElementName = 'ScrollElement';

// Set focus on target _after_ the content has been updated
export function focusOnChange(name, target, shadowTarget = undefined) {
  setTimeout(() => {
    const el = $(`va-accordion-item[data-chapter="${name}"]`);
    const focusTarget = el?.querySelector(target);
    if (focusTarget && shadowTarget) {
      focusElement(focusTarget.shadowRoot?.querySelector(shadowTarget));
    } else if (focusTarget) {
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

// Duplicate of function in platform/utilities/ui/scroll
export function scrollToFirstError() {
  // [error] will focus any web-components with an error message
  const errorEl = document.querySelector(
    '.usa-input-error, .input-error-date, [error]',
  );
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
