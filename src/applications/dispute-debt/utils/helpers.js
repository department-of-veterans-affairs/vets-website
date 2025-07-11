export const setPageFocus = selector => {
  const el = document.querySelector(selector);
  if (el) {
    el.setAttribute('tabIndex', -1);
    el.focus();
  } else {
    document.querySelector('#main h1').setAttribute('tabIndex', -1);
    document.querySelector('#main h1').focus();
  }
};
