import {
  focusElement,
  scrollTo,
  scrollToFirstError,
} from '~/platform/utilities/ui';

import { $ } from '~/platform/forms-system/src/js/utilities/ui';

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
    focusElement('#main h3');
  }
};
