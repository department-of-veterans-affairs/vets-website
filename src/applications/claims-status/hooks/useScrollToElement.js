import { useCallback } from 'react';

/**
 * Custom hook for scrolling to elements on the page
 * @param {string} selector - CSS selector or data-testid to find the element
 * @param {object} options - ScrollIntoView options (default: { behavior: 'smooth' })
 * @returns {Function} - Function to trigger the scroll
 */
const useScrollToElement = (selector, options = { behavior: 'smooth' }) => {
  return useCallback(
    () => {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView(options);
      }
    },
    [selector, options],
  );
};

export default useScrollToElement;
