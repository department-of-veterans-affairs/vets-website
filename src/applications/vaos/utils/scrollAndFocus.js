// todo: potential refactor opportunity

import { focusElement } from 'platform/utilities/ui';

// To keep selector but add a delay, make sure to pass undefined and NOT null, as it will override the default parameter
// e.g. scrollAndFocus(undefined, 50);
export function scrollAndFocus(selector = 'h1,.loading-indicator', delay = 0) {
  const el = document.querySelector(selector);
  // Preserve the existing behavior - focus immediately if no delay is specified
  if (!delay) {
    focusElement(el);
    return;
  }
  // setTimeout even with 0 delay will occur on the next execution cycle because of how JS event loop works
  setTimeout(() => {
    focusElement(el);
  }, delay);
}

export const focusFormHeader = () => {
  focusElement('h1', {}, document.querySelector('va-radio'));
};
