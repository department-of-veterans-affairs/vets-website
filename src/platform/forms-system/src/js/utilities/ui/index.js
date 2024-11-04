import Scroll from 'react-scroll';
import {
  focusElement,
  focusByOrder,
  scrollToFirstError,
  getScrollOptions,
} from '../../../../../utilities/ui';
import { webComponentList } from '../../web-component-fields/webComponentList';
import {
  SCROLL_ELEMENT_SUFFIX,
  FOCUSABLE_ELEMENTS,
  ERROR_ELEMENTS,
} from '../../../../../utilities/constants';

export const $ = (selectorOrElement, root) =>
  typeof selectorOrElement === 'string'
    ? (root || document).querySelector(selectorOrElement)
    : selectorOrElement;

export const $$ = (selector, root) => [
  ...(root || document).querySelectorAll(selector),
];

/**
 * fixSelector
 * When a page name includes a colon, e.g. "view:exampleFoo", the name ends up
 * in a scroll element with name="view:exampleFooScrollElement". Using
 * querySelector without escaping the colon will fail to find the target
 * Note: We shouldn't be passing in something like `:not([name="test"])`
 */
const REGEXP_COLON = /:/g;
export const fixSelector = selector => selector.replace(REGEXP_COLON, '\\:');

export {
  focusElement,
  focusByOrder,
  scrollToFirstError,
  getScrollOptions,
  ERROR_ELEMENTS,
};

/**
 * Find all the focusable elements within a block
 * @param {HTMLElement|node} block - wrapping element
 * @return {HTMLElement[]}
 */
export const getFocusableElements = (
  block,
  {
    returnWebComponent = false,
    focusableElements = FOCUSABLE_ELEMENTS,
    focusableWebComponents = webComponentList,
  } = {},
) => {
  let elements = [];

  if (block) {
    elements = [
      ...block.querySelectorAll(
        [...focusableElements, ...focusableWebComponents].join(','),
      ),
    ]
      .map(el => {
        // TODO: Fix this to ignore disabled web components
        if (el.shadowRoot && !returnWebComponent) {
          return getFocusableElements(el.shadowRoot, {
            focusableElements,
            focusableWebComponents,
          });
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

/**
 * Set focus on target _after_ the content has been updated; used on the review
 * & submit page after editing a page, and then after updating the page and
 * setting focus back on the page's edit button
 * @param {*} name - page name which is added to the associated scroll element
 * @param {*} target - target within the named target page
 * @param {*} shadowTarget - target within shadow DOM within target
 */
export function focusOnChange(name, target, shadowTarget = undefined) {
  setTimeout(() => {
    const el = $(`[name="${fixSelector(name)}${SCROLL_ELEMENT_SUFFIX}"]`);
    const focusTarget = el?.nextElementSibling?.querySelector(target);
    if (focusTarget && shadowTarget) {
      focusElement(shadowTarget, {}, focusTarget);
    } else if (focusTarget) {
      focusElement(focusTarget);
    }
  });
}

export const scrollToElement = name => {
  const el =
    typeof name === 'string' && name.includes('name=')
      ? $(fixSelector(name))
      : name;

  if (name && el) {
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
  window.Forms = window.Forms || {};

  // Set default scroll values if they don't exist
  window.Forms.scroll = window.Forms.scroll || {
    duration: 500,
    delay: 0,
    smooth: true,
  };

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  // If user prefers reduced motion, merge the settings
  if (prefersReducedMotion) {
    window.Forms.scroll = {
      ...window.Forms.scroll,
      duration: 0,
      delay: 0,
      smooth: false,
    };
  }
}
