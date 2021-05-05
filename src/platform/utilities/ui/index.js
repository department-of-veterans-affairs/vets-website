import Scroll from 'react-scroll';
import * as ReactIs from 'react-is';

export function displayFileSize(size) {
  if (size < 1024) {
    return `${size}B`;
  }

  const kbSize = size / 1024;
  if (kbSize < 1024) {
    return `${Math.round(kbSize)}KB`;
  }

  const mbSize = kbSize / 1024;
  return `${Math.round(mbSize)}MB`;
}

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

// Allows smooth scrolling to be overridden by our E2E tests
export function getScrollOptions(additionalOptions) {
  const globals = window.VetsGov || {};
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
    Scroll.animateScroll.scrollTo(position - 10, getScrollOptions());
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

/* Converts a percentage decimal number to a percentage number.
*
* Returns a string
* ex. displayPercent(.91) returns "91%"
* Remember that `toFixed()` rounds, so, if a decimal number such as .9177 is sent in as such:
* displayPercent(.9177, 1), with "1" being the number of desired places to display
* the output is: "91.8%"
*
* @param decimalNumber - the decimal number to convert
* @param places (optional) - the number of places after the decimal sign to display
*/
export function displayPercent(decimalNumber, places = 0) {
  return `${(decimalNumber * 100).toFixed(places)}%`;
}

export function isReactComponent(value) {
  return (
    typeof value !== 'string' &&
    !ReactIs.isElement(value) &&
    !ReactIs.isFragment(value) &&
    ReactIs.isValidElementType(value)
  );
}

/**
 * Accepts a string of numbers as an argument
 * and returns a formatted SSN with dashes.
 */
export function formatSSN(ssnString = '') {
  let val = ssnString;

  // Strips any dashes or spaces out of the string if they are included
  if (val.includes('-') || val.includes(' ')) {
    val = val.replace(/[- ]/g, '');
  }
  val = val.replace(/^(.{3})(.{1,2})/, '$1-$2');
  val = val.replace(/^(.{3})-(.{2})(.{1,4})$/, '$1-$2-$3');
  return val;
}
