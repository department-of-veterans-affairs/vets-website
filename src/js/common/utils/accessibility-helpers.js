const TAB = 9;
const ESCAPE = 27;

function isWideScreen() {
  return matchMedia('(min-width: 768px)').matches;
}

function isEscape(e) {
  return e.which === ESCAPE;
}

function isTab(e) {
  return e.which === TAB && !e.shiftKey;
}

function isReverseTab(e) {
  return e.which === TAB  && e.shiftKey;
}

function getTabbableElements(node) {
  return node.querySelectorAll('input,select,a[href],textarea,button,[tabindex]');
}

export { isWideScreen, isEscape, isTab, isReverseTab, getTabbableElements };
