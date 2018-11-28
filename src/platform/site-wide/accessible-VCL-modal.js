import {
  isEscape,
  isTab,
  isReverseTab,
  getTabbableElements,
} from '../utilities/accessibility';

/*
 * Creates function that captures/releases Veterans Crisis Line modal focus.
 */
export function addFocusBehaviorToCrisisLineModal() {
  const overlay = document.getElementById('modal-crisisline');
  const modal = document.querySelector('.va-crisis-panel.va-modal-inner');
  const tabbableElements = getTabbableElements(modal);
  let openControl;
  const closeControl = tabbableElements[0];
  const lastTabbableElement = tabbableElements[tabbableElements.length - 1];
  const triggers = Array.from(
    document.querySelectorAll('[data-show="#modal-crisisline"]'),
  );

  function captureFocus(e) {
    if (e.target === closeControl) {
      if (isReverseTab(e)) {
        e.preventDefault();
        lastTabbableElement.focus();
      }
    }
    if (e.target === lastTabbableElement) {
      if (isTab(e)) {
        e.preventDefault();
        closeControl.focus();
      }
    }
  }

  function closeModal(e) {
    if (isEscape(e)) {
      overlay.classList.remove('va-overlay--open');
      document.body.classList.remove('va-pos-fixed');
      openControl.focus();
    }
  }

  function resetFocus() {
    openControl.focus();
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

document.addEventListener(
  'DOMContentLoaded',
  addFocusBehaviorToCrisisLineModal,
);
