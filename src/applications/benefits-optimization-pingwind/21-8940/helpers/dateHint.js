import { useEffect } from 'react';
import { waitForShadowRoot } from 'platform/utilities/ui/webComponents';

const HIDE_DEFAULT_DATE_HINT_ATTR = 'data-hide-default-date-hint';
const HIDE_DEFAULT_DATE_HINT_STYLE = 'hide-default-date-hint-style';
const DEFAULT_HINT_CSS = '#dateHint { display: none; }';

const hideDefaultDateHintOnElement = async element => {
  if (!element || element.hasAttribute(HIDE_DEFAULT_DATE_HINT_ATTR)) {
    return;
  }

  element.setAttribute(HIDE_DEFAULT_DATE_HINT_ATTR, 'pending');

  try {
    const host = await waitForShadowRoot(element);
    const shadowRoot = host?.shadowRoot;

    if (!shadowRoot) {
      element.removeAttribute(HIDE_DEFAULT_DATE_HINT_ATTR);
      return;
    }

    if (
      !shadowRoot.querySelector(`style[data-${HIDE_DEFAULT_DATE_HINT_STYLE}]`)
    ) {
      const style = document.createElement('style');
      style.setAttribute(`data-${HIDE_DEFAULT_DATE_HINT_STYLE}`, 'true');
      style.textContent = DEFAULT_HINT_CSS;
      shadowRoot.appendChild(style);
    }

    element.setAttribute(HIDE_DEFAULT_DATE_HINT_ATTR, 'true');
  } catch (_error) {
    element.removeAttribute(HIDE_DEFAULT_DATE_HINT_ATTR);
  }
};

export const HideDefaultDateHint = () => {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const elements = document.querySelectorAll('va-memorable-date, va-date');
    elements.forEach(element => {
      hideDefaultDateHintOnElement(element);
    });

    return undefined;
  }, []);

  return null;
};

export default HideDefaultDateHint;
