import { useEffect } from 'react';

/**
 * Updates the "Skip to content" link to point at the chatbot container header for accessibility.
 * Runs once on mount and mutates the DOM outside virtual agent's app render tree (the website header).
 */
const useSkipLinkFix = () => {
  useEffect(() => {
    const skipToContentLink = document.querySelector(
      'a.show-on-focus[href="#content"]',
    );
    if (skipToContentLink) {
      skipToContentLink.removeAttribute('onclick');
      skipToContentLink.innerHTML = 'Skip to chatbot';
      skipToContentLink.setAttribute('href', '#chatbot-header');
    }
  }, []);
};

export default useSkipLinkFix;
