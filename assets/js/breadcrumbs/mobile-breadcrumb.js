var config = {
  containerString: 'va-breadcrumb',
  listString: 'va-breadcrumb-list',
  jsHiddenClass: 'js-hide',
  jsVisualClass: 'js-visual',
  mobileClass: 'va-nav-breadcrumbs-list__mobile-link',
  triggerDelay: 500,
  triggerWidth: 425,
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
  clone.classList.add(config.jsHiddenClass);

  return clone;
}

function sliceMobileLink(targetId) {
  var target = document.getElementById(targetId);
  var clonedTarget = target.cloneNode(true);
  var targetList = clonedTarget.children;

  var listArr = Array.prototype.slice.call(targetList);

  var breadcrumbLink = listArr.slice(-2, -1);
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
    breadcrumb.classList.add(config.jsHiddenClass);
    clone.classList.remove(config.jsHiddenClass);
  } else {
    clone.classList.add(config.jsHiddenClass);
    breadcrumb.classList.remove(config.jsHiddenClass);
  }
}

function buildMobileBreadcrumb(parentId, targetId) {
  var container = document.getElementById(parentId);
  var target = document.getElementById(targetId);

  var clonedList = cloneList(target, targetId);
  var mobileLink = sliceMobileLink(targetId);

  // Hide the original breadcrumb, because we have to
  // decide page width first, then determine which
  // breadcrumb to show.
  target.classList.add(config.jsHiddenClass);

  // Append the sliced mobile breadcrumb to cloned <ul>
  clonedList.appendChild(mobileLink[0]);

  // Append cloned <ul> to <nav>
  container.appendChild(clonedList);

  // Determine which breadcrumb <ul> to show
  if (window.innerWidth <= config.triggerWidth) {
    clonedList.classList.remove(config.jsHiddenClass);
  } else {
    target.classList.remove(config.jsHiddenClass);
  }

  // Reveal the correct breadcrumb list
  container.classList.remove(config.jsVisualClass);
}

// Check for breadcrumb on page load
window.addEventListener('DOMContentLoaded', function() {
  buildMobileBreadcrumb(config.containerString, config.listString);
});

// Pause the breadcrumb swap for 500ms
window.addEventListener('resize', function() {
  debouncedToggleLinks(config.listString);
});
