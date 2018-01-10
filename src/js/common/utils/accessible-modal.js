/*
 * Creates function that captures Veterans Crisis Line modal focus.
 */

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.queryselector('.va-crisis-panel.va-modal-inner');
  const closeControl = modal.getelementsbytagname('button')[0];
  const lastTabbableElement = modal.querySelector('a[href="https://www.veteranscrisisline.net/"]');

  function captureFocus(e) {
    if (e.target === closeControl) {
      if (e.shiftKey && e.which === 'TAB') {
        e.preventDefault();
        lastTabbableElement.focus();
      }
    }
    if (e.target === lastTabbableElement) {
      if (!e.shiftKey && e.which === 'TAB') {
        e.preventDefault();
        closeControl.focus();
      }
    }
  }

  closeControl.addEventListener('keydown', captureFocus);
  lastTabbableElement.addEventListener('keydown', captureFocus);
});
