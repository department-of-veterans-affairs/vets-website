import Scroll from 'react-scroll';

const scroller = Scroll.animateScroll;

export function scrollToTop() {
  scroller.scrollToTop({
    duration: 500,
    delay: 0,
    smooth: true,
  });
}

export function setFocus(selector) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  el.setAttribute('tabIndex', -1);
  el.focus();
}

export function setPageFocus(selector = '#main h1') {
  const notification = document.querySelector('.claims-notification');
  if (notification) {
    notification.setAttribute('tabIndex', -1);
    notification.focus();
  } else {
    setFocus(selector);
  }
}

export function setUpPage(scroll = true, focusSelector = '#main h1') {
  if (!scroll) {
    scrollToTop();
  }
  setPageFocus(focusSelector);
}

export function isTab(url) {
  return url &&
    (url.endsWith('status') || url.endsWith('files') || url.endsWith('details'));
}

