import { isTab, isReverseTab } from './accessible-menus';
/*
 * Creates function that captures Veterans Crisis Line modal focus.
 */

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.va-crisis-panel.va-modal-inner');
  const closeControl = modal.getElementsByTagName('button')[0];
  const lastTabbableElement = modal.querySelector('a[href="https://www.veteranscrisisline.net/"]');

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

  closeControl.addEventListener('keydown', captureFocus);
  lastTabbableElement.addEventListener('keydown', captureFocus);
});
