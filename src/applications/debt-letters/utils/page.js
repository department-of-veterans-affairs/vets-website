export const setFocus = selector => {
  const el =
    typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (el) {
    el.setAttribute('tabIndex', -1);
    el.focus();
  }
};

export const setPageFocus = (selector = '.va-nav-breadcrumbs') => {
  const el = document.querySelector(selector);
  if (el) {
    setFocus(el);
  } else {
    setFocus('#main h1');
  }
};
