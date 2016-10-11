import _ from 'lodash';

function setActionBoxAtTop(actionBox) {
  actionBox.style.position = 'fixed';
  actionBox.style.right = `${(document.body.offsetWidth - 1000) / 2}px`;
  actionBox.style.top = '10px';
}

function resetActionBox(actionBox) {
  actionBox.style.position = 'absolute';
  actionBox.style.right = 0;
  actionBox.style.top = '30px';
}

window.onload = function stickyActionBox() {
  const actionBox = document.querySelectorAll('.show-for-large-up .sticky-action-box')[0];
  let offset = actionBox.getBoundingClientRect();

  window.addEventListener('scroll', _.throttle(() => {
    if (offset.top < 0) {
      setActionBoxAtTop(actionBox);

      offset = actionBox.getBoundingClientRect();
    }

    if (document.body.scrollTop > offset.top) {
      setActionBoxAtTop(actionBox);
    } else {
      resetActionBox(actionBox);
    }
  }, 100));
};
