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
  smallActionBox.style.marginLeft = '0';
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
  smallActionBox.style.width = '';
  smallActionBox.style.marginLeft = '';
}

function moveActionBoxOnScroll(actionBox, offset, positionFunction, resetFunction) {
  let initialPosition = offset.height > 0 ? offset.top + document.body.scrollTop : null;
  window.addEventListener('scroll', _.throttle(() => {
    if (offset.top < 0) {
      positionFunction(actionBox);
      offset = actionBox.getBoundingClientRect();
    }

    if (initialPosition && document.body.scrollTop > initialPosition) {
      positionFunction(actionBox);
    } else {
      resetFunction(actionBox);
    }
  }, 100));
  window.addEventListener('resize', _.throttle(() => {
    if (!initialPosition) {
      const newOffset = actionBox.getBoundingClientRect();
      if (newOffset.height) {
        initialPosition = newOffset.top + document.body.scrollTop;
      }
    }
  }, 100));
}

function stickyActionBox() {
  const largeActionBox = document.querySelectorAll('.show-for-large-up .sticky-action-box')[0];

  if (largeActionBox) {
    const offsetLarge = largeActionBox.getBoundingClientRect();
    moveActionBoxOnScroll(largeActionBox, offsetLarge, setLargeActionBoxAtTop, resetLargeActionBox);
  }

  const smallActionBox = document.querySelectorAll('.hide-for-large-up .sticky-action-box')[0];

  if (smallActionBox) {
    const offsetSmall = smallActionBox.getBoundingClientRect();
    moveActionBoxOnScroll(smallActionBox, offsetSmall, setSmallActionBoxAtTop, resetSmallActionBox);
  }
}

if (window.addEventListener) {
  window.addEventListener('load', stickyActionBox, false);
} else {
  window.attachEvent('onload', stickyActionBox);
}
