import {
  focusElement,
  scrollTo,
  scrollToFirstError,
  scrollAndFocus,
} from 'platform/utilities/ui';
import { $ } from '~/platform/forms-system/src/js/utilities/ui';

import { getEditContactInformation } from './contact-info';

export const focusFirstError = (_index, root) => {
  const error = $('[error], .usa-input-error', root);
  if (error) {
    scrollToFirstError({ focusOnAlertRole: true });
    return true;
  }
  return false;
};

export const focusH3 = (index, root) => {
  scrollTo('topContentElement');
  if (!focusFirstError(index, root)) {
    // va-alert h2 = prefill alert on Veteran info page
    // #main h3 = main heading all other pages
    focusElement('va-alert h2, #main h3');
  }
};

export const focusContactInfo = () => {
  const { name } = getEditContactInformation();
  // If name is set in session storage, it means a contact field was just edited
  // so, scroll & focus code internal to VeteranContactInformation is run.
  // Otherwise, scroll to the top of the page
  if (!name) {
    scrollAndFocus('h3');
  }
};
