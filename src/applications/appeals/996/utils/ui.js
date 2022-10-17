import Scroll from 'react-scroll';
import { focusElement, getScrollOptions } from 'platform/utilities/ui';

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
    Scroll.animateScroll.scrollTo(position - offset, getScrollOptions());
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

// work-around for error message not showing :(
export const areaOfDisagreementWorkAround = (hasSelection, index) => {
  // we can't target the fieldset because it doesn't get re-rendered on other
  // pages by React
  // see https://dsva.slack.com/archives/CBU0KDSB1/p1620840904269500
  const label = $(`#area-of-disagreement-label-${index}`);
  if (label) {
    const showError = label.dataset.submitted === 'true' && !hasSelection;
    label.classList.toggle('usa-input-error', showError);
  }
};
