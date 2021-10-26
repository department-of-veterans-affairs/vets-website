// Relative imports.
import { focusElement } from 'platform/utilities/ui';
import {
  getTabbableElements,
  isEscape,
  isReverseTab,
  isTab,
} from '../../../utilities/accessibility';

// Legacy code for accessibility.
export const addFocusBehaviorToCrisisLineModal = () => {
  const overlay = document.getElementById('modal-crisisline');
  const modal = document.querySelector('.va-crisis-panel.va-modal-inner');
  const tabbableElements = getTabbableElements(modal);
  let openControl;
  const closeControl = tabbableElements[0];
  const lastTabbableElement = tabbableElements[tabbableElements.length - 1];
  const triggers = Array.from(
    document.querySelectorAll('[data-show="#modal-crisisline"]'),
  );

  const captureFocus = event => {
    if (event.target === closeControl && isReverseTab(event)) {
      event.preventDefault();
      focusElement(lastTabbableElement);
    }
    if (event.target === lastTabbableElement && isTab(event)) {
      event.preventDefault();
      focusElement(closeControl);
    }
  };

  const closeModal = event => {
    if (isEscape(event)) {
      overlay.classList.remove('va-overlay--open');
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
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      openControl = trigger;
    });
  });

  modal.addEventListener('keydown', closeModal);
  closeControl.addEventListener('click', resetFocus);
  closeControl.addEventListener('keydown', captureFocus);
  lastTabbableElement.addEventListener('keydown', captureFocus);
};

// Legacy code for Veteran Crisis Line, megamenu, and mobile menu buttons.
export const addOverlayTriggers = () => {
  const overlays = document.querySelectorAll(
    '.va-overlay-trigger, .va-overlay',
  );

  const toggleOverlay = domEvent => {
    const overlayTarget = domEvent.currentTarget; // The overlay to open or close
    const clickTarget = domEvent.target; // The element clicked

    /*
    overlayId will be _either_
    - The value of element.getAttribute('href')
    - The value of element.dataset.show

    A .va-overlay-trigger element should have either a data-show attribute
    (preferred) or an href attribute.
    */
    const overlayId =
      overlayTarget.getAttribute('href') || overlayTarget.dataset.show;

    const shouldCloseOverlay =
      overlayTarget.classList.contains('va-overlay') &&
      clickTarget.classList.contains('va-overlay-close');

    if (shouldCloseOverlay) {
      overlayTarget.classList.remove('va-overlay--open');
      document.body.classList.remove('va-pos-fixed');
    } else if (overlayId) {
      const overlay = document.querySelector(overlayId);
      overlay.classList.add('va-overlay--open');
      overlay.querySelector('a').focus();
      document.body.classList.add('va-pos-fixed');
    }
  };
  Array.from(overlays).forEach(element => {
    element.addEventListener('click', toggleOverlay);
  });
};
