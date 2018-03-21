var config = {
  hiddenClass: 'js-hide',
  mobileClass: 'va-nav-breadcrumbs-list__mobile-link',
  triggerDelay: 500,
  triggerWidth: 425
};

var debouncedToggleLinks = _debounce(function(targetId) {
  toggleLinks(targetId);
}, config.triggerDelay);

// https://davidwalsh.name/javascript-debounce-function
function _debounce(func, wait, immediate) {
  // Time to wait in milliseconds
  var timeout;

  return function() {
    var self = this;
    var args = arguments;
    var later = function() {
      timeout = null;

      if (!immediate) func.apply(self, args);
    };
    var callNow = immediate && !timeout;

    // Clear any existing timeouts
    clearTimeout(timeout);

    // Execute after timeout period
    timeout = setTimeout(later, wait);

    // If callNow evaluates true, execute immediately
    // Not recommended for resource-intensive events like resize
    if (callNow) {
      func.apply(self, args);
    }
  };
}

function cloneList(target, targetId) {
  var clone = target.cloneNode();

  clone.setAttribute('id', targetId + '-clone');
  clone.classList.add(config.hiddenClass);

  return clone;
}

function sliceMobileLink(targetId) {
  var target = document.getElementById(targetId);
  var clonedTarget = target.cloneNode(true);
  var targetList = clonedTarget.children;

  var listArr = Array.prototype.slice.call(targetList);

  var breadcrumbLink = listArr.slice(-1);
  var textString = breadcrumbLink[0].children[0].innerText.trim();

  breadcrumbLink[0].classList.add(config.mobileClass);
  breadcrumbLink[0].children[0].innerText = textString;
  breadcrumbLink[0].children[0].setAttribute(
    'aria-label',
    'Previous step: ' + textString.trim()
  );

  return breadcrumbLink;
}

function toggleLinks(targetId) {
  var breadcrumb = document.getElementById(targetId);
  var clone = document.getElementById(targetId + '-clone');

  if (window.innerWidth <= config.triggerWidth) {
    breadcrumb.classList.add(config.hiddenClass);
    clone.classList.remove(config.hiddenClass);
  } else {
    clone.classList.add(config.hiddenClass);
    breadcrumb.classList.remove(config.hiddenClass);
  }
}

function buildMobileBreadcrumb(parentId, targetId) {
  var container = document.getElementById(parentId);
  var target = document.getElementById(targetId);

  var clonedList = cloneList(target, targetId);
  var mobileLink = sliceMobileLink(targetId);

  target.classList.add(config.hiddenClass);

  mobileLink.map(function(item) {
    return clonedList.appendChild(item);
  });

  container.appendChild(clonedList);

  if (window.innerWidth <= config.triggerWidth) {
    clonedList.classList.remove(config.hiddenClass);
  } else {
    target.classList.remove(config.hiddenClass);
  }

  container.classList.remove('js-visual');
}

// Check for breadcrumb on page load
window.addEventListener('DOMContentLoaded', function() {
  buildMobileBreadcrumb('va-breadcrumb', 'va-breadcrumb-list');
});

// Pause the breadcrumb swap for 500ms
window.addEventListener('resize', function() {
  debouncedToggleLinks('va-breadcrumb-list');
});
