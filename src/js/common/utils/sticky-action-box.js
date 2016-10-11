window.onload = function stickyActionBox() {
  const actionBox = document.querySelectorAll('.show-for-large-up .sticky-action-box')[0];
  const offset = actionBox.getBoundingClientRect();

  window.addEventListener('scroll', () => {
    if (document.body.scrollTop > offset.top) {
      actionBox.style.position = 'fixed';
      actionBox.style.right = `${(document.body.offsetWidth - 1000) / 2}px`;
      actionBox.style.top = '10px';
    } else {
      actionBox.style.position = 'absolute';
      actionBox.style.right = 0;
      actionBox.style.top = 0;
    }
  });
};
