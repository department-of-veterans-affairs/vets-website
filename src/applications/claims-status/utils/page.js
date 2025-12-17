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
    scrollAndFocus(el, { behavior: 'instant' });
  } else {
    setFocus('#main h1');
  }
}

export function setUpPage(scroll = true, focusSelector = 'h1') {
  if (!scroll) {
    scrollToTop({ behavior: 'instant' });
  }
  scrollAndFocus(document.querySelector(focusSelector), {
    behavior: 'instant',
  });
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

export const focusNotificationAlert = () => {
  const alert = document.querySelector('.claims-alert');
  if (alert) {
    setFocus(alert);
    setTimeout(() => {
      if (document.activeElement !== alert) {
        setTimeout(() => {
          setFocus(alert);
        }, 150);
      }
    }, 0);
  }
};
