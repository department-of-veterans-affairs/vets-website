import { scrollAndFocus, scrollToTop } from 'platform/utilities/scroll';

export function setFocus(selector) {
  const el =
    typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (el) {
    el.setAttribute('tabIndex', -1);
    el.focus();
  }
}

export function setPageFocus(selector = 'h1') {
  const el = document.querySelector(selector);
  if (el) {
    scrollAndFocus(el);
  } else {
    setFocus('#main h1');
  }
}

export function setUpPage(scroll = true, focusSelector = 'h1') {
  if (!scroll) {
    scrollToTop();
  }
  scrollAndFocus(document.querySelector(focusSelector));
}

export function isTab(url) {
  return (
    url &&
    (url.endsWith('status') ||
      url.endsWith('files') ||
      url.endsWith('details') ||
      url.endsWith('overview'))
  );
}
