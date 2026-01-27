import { useEffect } from 'react';

/**
 * Adds a "Skip to Chatbot" link after the existing "Skip to content" link for accessibility.
 * Runs once on mount and mutates the DOM outside virtual agent's app render tree (the website header).
 * @hook
 * @return {void}
 */
const useSkipLinkFix = () => {
  useEffect(() => {
    const skipToContentLink = document.querySelector(
      'a.show-on-focus[href="#content"]',
    );
    if (skipToContentLink) {
      const chatbotSkipLink = document.createElement('a');
      chatbotSkipLink.className = 'show-on-focus';
      chatbotSkipLink.setAttribute('href', '#chatbot-header');
      chatbotSkipLink.innerHTML = 'Skip to Chatbot';
      skipToContentLink.after(chatbotSkipLink);
    }
  }, []);
};

export default useSkipLinkFix;
