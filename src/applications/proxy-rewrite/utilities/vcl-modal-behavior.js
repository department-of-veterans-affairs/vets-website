import {
  isEscape,
  isTab,
  isReverseTab,
  getTabbableElements,
} from 'platform/utilities/accessibility';

import { focusElement } from 'platform/utilities/ui';

// Used to add overlay behavior to VCL modal
export const addOverlayTriggers = () => {
  const vclModalTriggers = document?.querySelectorAll('.vcl-modal-open');
  const vclModalClose = document?.getElementById('vcl-modal-close');
  const vclModal = document?.getElementById('ts-modal-crisisline');

  const openModal = () => {
    vclModal?.classList.add('vcl-overlay--open');
    vclModal?.querySelector('a').focus();
    document.body?.classList.add('va-pos-fixed');
  };

  const closeModal = () => {
    vclModal?.classList.remove('vcl-overlay--open');
    document.body?.classList.remove('va-pos-fixed');
  };

  if (vclModalTriggers?.length) {
    Array.from(vclModalTriggers).forEach(trigger => {
      trigger.addEventListener('click', openModal);
    });
  }

  if (vclModalClose) {
    vclModalClose.addEventListener('click', closeModal);
  }
};

/*
 * Creates function that captures/releases Veterans Crisis Line modal focus.
 */
export const addFocusBehaviorToCrisisLineModal = () => {
  const overlay = document?.getElementById('ts-modal-crisisline');
  const modal = document?.querySelector('.vcl-crisis-panel.va-modal-inner');

  if (modal) {
    const tabbableElements = getTabbableElements(modal);
    let openControl;
    const closeControl = tabbableElements[0];
    const lastTabbableElement = tabbableElements?.[tabbableElements.length - 1];
    const triggers = Array.from(document?.querySelectorAll('.vcl-modal-open'));

    const captureFocus = e => {
      if (e.target === closeControl && isReverseTab(e)) {
        e.preventDefault();
        focusElement(lastTabbableElement);
      }
      if (e.target === lastTabbableElement && isTab(e)) {
        e.preventDefault();
        focusElement(closeControl);
      }
    };

    const closeModal = e => {
      if (isEscape(e)) {
        overlay.classList.remove('vcl-overlay--open');
        document.body.classList.remove('va-pos-fixed');
        focusElement(openControl);
      }
    };

    const resetFocus = () => {
      focusElement(openControl);
    };

    // We're saving the element that triggered this modal
    // in openControl, so that we can focus back on it later,
    // when the modal is closed
    triggers?.forEach(trigger => {
      trigger.addEventListener('click', () => {
        openControl = trigger;
      });
    });

    modal?.addEventListener('keydown', closeModal);
    closeControl?.addEventListener('click', resetFocus);
    closeControl?.addEventListener('keydown', captureFocus);
    lastTabbableElement?.addEventListener('keydown', captureFocus);
  }
};
