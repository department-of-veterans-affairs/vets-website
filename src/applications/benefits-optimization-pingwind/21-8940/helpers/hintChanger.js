import { useEffect } from 'react';
import { waitForShadowRoot } from 'platform/utilities/ui/webComponents';

const useDateHintUpdater = () => {
  useEffect(() => {
    const targetElements = ['va-memorable-date'];
    targetElements.forEach(selector => {
      document.querySelectorAll(selector).forEach(async component => {
        try {
          const el = await waitForShadowRoot(component);
          if (el?.shadowRoot) {
            const dateHintElement = el.shadowRoot.querySelector('#dateHint');
            if (dateHintElement) {
              dateHintElement.textContent = 'For example: January 19 2022';
            }
          }
        } catch (_) {
          // Fail silently
        }
      });
    });
  }, []);
};

const ChangeDefaultDateHint = () => {
  useDateHintUpdater();
  return null;
};

export const changeDefaultDateHint = ChangeDefaultDateHint;
