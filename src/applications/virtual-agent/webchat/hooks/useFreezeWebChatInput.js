import { useEffect } from 'react';

function getWebChatRoot() {
  if (typeof document === 'undefined') {
    return null;
  }
  return document.querySelector('[data-testid="webchat"]');
}

function getInputElement(root) {
  if (!root) return null;
  return (
    root.querySelector('input.webchat__send-box-text-box__input') ||
    root.querySelector('input[type="text"]')
  );
}

function getSendButtonElement(root) {
  if (!root) return null;
  return (
    root.querySelector('button.webchat__send-button') ||
    root.querySelector('button[aria-label], button[title]')
  );
}

function applyDisabledState(root) {
  try {
    const active = document.activeElement;
    if (active && typeof active.blur === 'function') {
      active.blur();
    }
  } catch (e) {
    // no-op
  }

  const input = getInputElement(root);
  const button = getSendButtonElement(root);

  if (input) {
    input.setAttribute('disabled', 'true');
    input.setAttribute('aria-disabled', 'true');
    input.setAttribute('tabIndex', '-1');
  }

  if (button) {
    button.setAttribute('disabled', 'true');
    button.setAttribute('aria-disabled', 'true');
    button.setAttribute('tabIndex', '-1');
  }
}

function clearDisabledState(root) {
  const input = getInputElement(root);
  const button = getSendButtonElement(root);

  if (input) {
    input.removeAttribute('disabled');
    input.removeAttribute('aria-disabled');
    input.removeAttribute('tabIndex');
  }

  if (button) {
    button.removeAttribute('disabled');
    button.removeAttribute('aria-disabled');
    button.removeAttribute('tabIndex');
  }
}

export default function useFreezeWebChatInput(isFrozen) {
  useEffect(
    () => {
      const root = getWebChatRoot();
      if (!root) {
        return undefined;
      }

      if (!isFrozen) {
        clearDisabledState(root);
        return undefined;
      }

      applyDisabledState(root);

      const Observer =
        (typeof window !== 'undefined' && window.MutationObserver) ||
        (typeof MutationObserver !== 'undefined' && MutationObserver);

      if (!Observer) {
        return () => {
          clearDisabledState(root);
        };
      }

      const observer = new Observer(() => {
        applyDisabledState(root);
      });

      observer.observe(root, {
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
        clearDisabledState(root);
      };
    },
    [isFrozen],
  );
}
