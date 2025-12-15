// todo: potential refactor opportunity

import { focusElement } from 'platform/utilities/ui';

// To keep selector but add a delay, make sure to pass undefined and NOT null, as it will override the default parameter
// e.g. scrollAndFocus(undefined, 50);
export function scrollAndFocus(selector = 'h1,.loading-indicator') {
  const el = document.querySelector(selector);
  focusElement(el);
}

export const focusFormHeader = () => {
  focusElement('h1', {}, document.querySelector('va-radio'));
};
