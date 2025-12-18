import * as ReactIs from 'react-is';

import {
  focusElement,
  focusByOrder,
  waitTime,
  waitForRenderThenFocus,
  defaultFocusSelector,
} from './focus';
import {
  getScrollOptions,
  scrollTo,
  scrollToTop,
  scrollToFirstError,
  scrollAndFocus,
} from '../scroll';
import { ERROR_ELEMENTS, FOCUSABLE_ELEMENTS } from '../constants';

export {
  focusElement,
  focusByOrder,
  waitTime,
  waitForRenderThenFocus,
  defaultFocusSelector,
  getScrollOptions,
  scrollTo,
  scrollToTop,
  scrollToFirstError,
  scrollAndFocus,
  ERROR_ELEMENTS,
  FOCUSABLE_ELEMENTS,
};

export function displayFileSize(size) {
  if (size == null) {
    return '';
  }

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

/**
 * Accepts a string of numbers as an argument
 * and returns a formatted ARN with dashes.
 */
export function formatARN(arnString = '') {
  let val = arnString;

  // Strips any dashes or spaces out of the string if they are included
  if (val.includes('-') || val.includes(' ')) {
    val = val.replace(/[- ]/g, '');
  }
  val = val.replace(/^(.{3})(.{1,2})/, '$1-$2');
  val = val.replace(/^(.{3})-(.{2})(.{1,4})$/, '$1-$2-$3');
  return val;
}

/**
 * Returns the appropriate singular or plural form of a word based on count.
 *
 * @param {number} count - The count to check
 * @param {string} singular - The singular form of the word
 * @param {string} [plural] - The plural form (defaults to singular + 's')
 * @returns {string} The appropriate form based on count
 *
 * @example
 * pluralize(1, 'issue') // 'issue'
 * pluralize(2, 'issue') // 'issues'
 * pluralize(1, 'child', 'children') // 'child'
 * pluralize(2, 'child', 'children') // 'children'
 */
export function pluralize(count, singular, plural = `${singular}s`) {
  // Type validation
  if (typeof singular !== 'string') {
    throw new Error('pluralize: singular parameter must be a string');
  }

  if (typeof plural !== 'string') {
    throw new Error('pluralize: plural parameter must be a string');
  }

  if (typeof count !== 'number') {
    throw new Error('pluralize: count parameter must be a number');
  }

  return count === 1 ? singular : plural;
}
