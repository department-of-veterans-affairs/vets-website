import Scroll from 'react-scroll';

const scroller = Scroll.animateScroll;

export function scrollToTop() {
  scroller.scrollToTop({
    duration: 500,
    delay: 0,
    smooth: true,
  });
}

export function setPageFocus(selector = '#main h1') {
  const el = document.querySelector(selector);
  el.setAttribute('tabIndex', -1);
  el.focus();
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

