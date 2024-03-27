import {
  isEscape,
  isTab,
  isReverseTab,
  getTabbableElements,
} from 'platform/utilities/accessibility';

import { focusElement } from 'platform/utilities/ui';

/*
 * Creates function that captures/releases Veterans Crisis Line modal focus.
 */
export default function addFocusBehaviorToCrisisLineModal() {
  const overlay = document.getElementById('ts-modal-crisisline');
  const modal = document.querySelector('.va-crisis-panel.va-modal-inner');
  const tabbableElements = getTabbableElements(modal);
  let openControl;
  const closeControl = tabbableElements[0];
  const lastTabbableElement = tabbableElements[tabbableElements.length - 1];
  const triggers = Array.from(document.querySelectorAll('.va-crisis-line'));

  function captureFocus(e) {
    if (e.target === closeControl && isReverseTab(e)) {
      e.preventDefault();
      focusElement(lastTabbableElement);
    }
    if (e.target === lastTabbableElement && isTab(e)) {
      e.preventDefault();
      focusElement(closeControl);
    }
  }

  function closeModal(e) {
    if (isEscape(e)) {
      overlay.classList.remove('va-overlay--open');
      document.body.classList.remove('va-pos-fixed');
      focusElement(openControl);
    }
  }

  function resetFocus() {
    focusElement(openControl);
  }

  // We're saving the element that triggered this modal
  // in openControl, so that we can focus back on it later,
  // when the modal is closed
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      openControl = trigger;
    });
  });

  modal.addEventListener('keydown', closeModal);
  closeControl.addEventListener('click', resetFocus);
  closeControl.addEventListener('keydown', captureFocus);
  lastTabbableElement.addEventListener('keydown', captureFocus);
}
