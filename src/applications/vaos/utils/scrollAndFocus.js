import { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';

export function scrollAndFocus(selector = 'h1,.loading-indicator') {
  const el = document.querySelector(selector);
  focusElement(el);
}

export function useScrollAndFocus() {
  useEffect(() => {
    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }

    scrollAndFocus();
  });
}
