import { useEffect, useCallback } from 'react';

export const useFocusHeading = ({
  shadowOnly = false,
  tabbable = true,
} = {}) => {
  const findHeading = useCallback(
    () => {
      // Check regular DOM first if shadowOnly is false
      if (!shadowOnly) {
        const mainH1 = document.querySelector('h1');
        if (mainH1) return mainH1;
      }

      // Check shadow DOM
      return Array.from(document.querySelectorAll('va-radio'))
        .map(host => host.shadowRoot?.querySelector('h1'))
        .find(Boolean);
    },
    [shadowOnly],
  );

  const focusHeading = useCallback(
    () => {
      const h1 = findHeading();

      if (h1) {
        if (!h1.hasAttribute('tabindex')) {
          h1.setAttribute('tabindex', tabbable ? '0' : '-1');
        }
        h1.focus();
        return true;
      }
      return false;
    },
    [findHeading],
  );

  useEffect(
    () => {
      // Initial focus attempt with retry logic
      const retryWithDelay = attemptsLeft => {
        if (focusHeading() || attemptsLeft <= 0) return;

        setTimeout(() => {
          retryWithDelay(attemptsLeft - 1);
        }, 100);
      };

      retryWithDelay(10);

      // Set up mutation observer
      const observer = new MutationObserver(() => {
        focusHeading();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    },
    [focusHeading],
  );
};
