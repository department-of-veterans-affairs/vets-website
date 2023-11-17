import { scrollAndFocus } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';

export function setFocus(selector) {
  const el =
    typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (el) {
    el.setAttribute('tabIndex', -1);
    el.focus();
  }
}

export function setPageFocus(selector = 'va-breadcrumbs') {
  const el = document.querySelector(selector);
  if (el) {
    scrollAndFocus(el);
  } else {
    setFocus('#main h1');
  }
}

export function setUpPage(scroll = true, focusSelector = 'va-breadcrumbs') {
  if (!scroll) {
    scrollToTop();
  }
  scrollAndFocus(document.querySelector(focusSelector));
}

export function isTab(url) {
  return (
    url &&
    (url.endsWith('status') || url.endsWith('files') || url.endsWith('details'))
  );
}
