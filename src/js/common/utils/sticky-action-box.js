/* eslint-disable no-param-reassign */

import _ from 'lodash';

function setLargeActionBoxAtTop(largeActionBox) {
  largeActionBox.style.position = 'fixed';
  largeActionBox.style.right = `${(document.body.offsetWidth - 1000) / 2}px`;
  largeActionBox.style.top = '10px';
}

function setSmallActionBoxAtTop(smallActionBox) {
  smallActionBox.style.position = 'fixed';
  smallActionBox.style.top = '0px';
  smallActionBox.style.left = '0px';
  smallActionBox.style.width = '100%';
}

function resetLargeActionBox(largeActionBox) {
  largeActionBox.style.position = 'absolute';
  largeActionBox.style.right = 0;
  largeActionBox.style.top = '30px';
}

function resetSmallActionBox(smallActionBox) {
  smallActionBox.style.position = 'initial';
  smallActionBox.style.top = 'initial';
  smallActionBox.style.left = 'initial';
  smallActionBox.style.width = '35rem';
}

function moveActionBoxOnScroll(actionBox, offset, positionFunction, resetFunction) {
  window.addEventListener('scroll', _.throttle(() => {
    if (offset.top < 0) {
      positionFunction(actionBox);
      offset = actionBox.getBoundingClientRect();
    }

    if (document.body.scrollTop > offset.top) {
      positionFunction(actionBox);
    } else {
      resetFunction(actionBox);
    }
  }, 100));
}

window.onload = function stickyActionBox() {
  const largeActionBox = document.querySelectorAll('.show-for-large-up .sticky-action-box')[0];
  const smallActionBox = document.querySelectorAll('.hide-for-large-up .sticky-action-box')[0];
  const offsetLarge = largeActionBox.getBoundingClientRect();
  const offsetSmall = smallActionBox.getBoundingClientRect();

  moveActionBoxOnScroll(largeActionBox, offsetLarge, setLargeActionBoxAtTop, resetLargeActionBox);
  moveActionBoxOnScroll(smallActionBox, offsetSmall, setSmallActionBoxAtTop, resetSmallActionBox);
};
