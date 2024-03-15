/**
 * Containing focus within a parent element. listOfSelectors argument is used to determine which elements are focusable.
 * When focus is on the last focusable element, pressing tab will focus on the first focusable element and vice versa.
 * This is useful for custom modals, navigation menus, etc.
 * @param {*} parentElement
 * @param {*} listOfSelectors
 * @param {*} escapeCallback
 * @example trapFocus(document.querySelector('.sidebar-nav'), 'a[href]:not([disabled]), button:not([disabled])', () => { console.log('escape pressed') });
 * @example trapFocus(reactElementRef.current, 'a[href]:not([disabled]), button:not([disabled])', handleEscaePress);
 */

export const trapFocus = (
  parentElement,
  listOfSelectors = 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])',
  escapeCallback,
) => {
  const focusableEls = parentElement.querySelectorAll(listOfSelectors);
  const firstFocusableEl = focusableEls[0];
  const lastFocusableEl = focusableEls[focusableEls.length - 1];
  const KEYCODE_TAB = 9;

  parentElement.addEventListener('keydown', e => {
    const isTabPressed = e.key === 'Tab' || e.keyCode === KEYCODE_TAB;
    const isEscPressed = e.key === 'Escape' || e.keyCode === 27;

    if (isEscPressed && escapeCallback) {
      escapeCallback();
      return;
    }

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) {
      /* shift + tab */ if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        e.preventDefault();
      }
    } /* tab */ else if (document.activeElement === lastFocusableEl) {
      firstFocusableEl.focus();
      e.preventDefault();
    }
  });
};
