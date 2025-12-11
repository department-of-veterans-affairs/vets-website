import {
  focusElement,
  scrollTo,
  scrollToFirstError,
  scrollAndFocus,
} from 'platform/utilities/ui';
import { $ } from '~/platform/forms-system/src/js/utilities/ui';

import { getEditContactInformation } from './contact-info';

/**
 * Move focus to first error on the page
 * @param {number} _index - Unused array index number
 * @param {HTMLElement|undefined} root - root element to search within
 * @returns {boolean} - true if an error element was found and focused,
 * otherwise false
 */
export const focusFirstError = (_index, root) => {
  const error = $('[error], .usa-input-error', root);
  if (error) {
    scrollToFirstError({ focusOnAlertRole: true });
    return true;
  }
  return false;
};

/**
 * Focus on first error if present, focus on the h2 inside a prefill alert, or
 * the main heading (h3) in that order of priority
 * @param {number} index - Form data array index number
 * @param {HTMLElement|undefined} root - root element to search within
 * @returns {void}
 */
export const focusH3 = (index, root) => {
  scrollTo('topContentElement');
  if (!focusFirstError(index, root)) {
    // va-alert h2 = prefill alert on Veteran info page
    // #main h3 = main heading all other pages
    focusElement('va-alert h2, #main h3');
  }
};

/**
 * Focus on contact information h3, or first error if present
 * @returns {void}
 */
export const focusContactInfo = () => {
  const { name } = getEditContactInformation();
  // If name is set in session storage, it means a contact field was just edited
  // so, scroll & focus code internal to VeteranContactInformation is run.
  // Otherwise, scroll to the top of the page
  if (!name) {
    scrollAndFocus('h3');
  }
};

/**
 * Focus on the prefill alert on the Veteran Information page
 * @returns {void}
 */
export const focusPrefillAlert = () => {
  focusElement('va-alert');
};
