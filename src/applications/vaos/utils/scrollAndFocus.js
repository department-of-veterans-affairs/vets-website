// todo: potential refactor opportunity

import { focusElement } from 'platform/utilities/ui';

export function scrollAndFocus(selector = 'h1,.loading-indicator') {
  const el = document.querySelector(selector);
  focusElement(el);
}
