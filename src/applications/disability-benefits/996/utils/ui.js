import { focusElement, getScrollOptions } from 'platform/utilities/ui';
import scrollTo from 'platform/utilities/ui/scrollTo';

export const $ = (selector, root) => (root || document).querySelector(selector);
export const $$ = (selector, root) => [
  ...(root || document).querySelectorAll(selector),
];

const scrollAndFocusFunctions = (selector, offset) => {
  const el = $(selector);
  if (el) {
    const currentPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const position = el.getBoundingClientRect().top + currentPosition;
    scrollTo(position - offset, getScrollOptions());
    focusElement(el);
  }
};

export const scrollAndFocus = ({ selector, offset = 50, timer }) => {
  if (timer) {
    setTimeout(() => scrollAndFocusFunctions(selector, offset), timer);
  } else {
    scrollAndFocusFunctions(selector, offset);
  }
};
