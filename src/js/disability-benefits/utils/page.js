import Scroll from 'react-scroll';

const scroller = Scroll.animateScroll;

export const basename = '/disability-benefits/track-claims';

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

export function setPageFocus(selector = '.va-nav-breadcrumbs') {
  const el = document.querySelector(selector);
  if (el) {
    setFocus(el);
  } else {
    setFocus('#main h1');
  }
}

export function setUpPage(scroll = true, focusSelector = '.va-nav-breadcrumbs') {
  if (!scroll) {
    scrollToTop();
  }
  setPageFocus(focusSelector);
}

export function isTab(url) {
  return url &&
    (url.endsWith('status') || url.endsWith('files') || url.endsWith('details'));
}

