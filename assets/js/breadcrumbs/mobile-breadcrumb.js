var config = {
  containerString: 'va-breadcrumbs',
  listString: 'va-breadcrumbs-list',
  jsHiddenClass: 'js-hide',
  jsVisualClass: 'js-visual',
  mobileClass: 'va-nav-breadcrumbs-list__mobile-link',
  triggerDelay: 500,
  triggerWidth: 425,
};

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

/**
 * Returns this model's attributes as...
 *
 * @method _isElement
 * @type {Object} Copy of ...
 */
function _isElement(el) {
  return el instanceof Element;
}

function cloneList(target, targetId) {
  var clone = target.cloneNode();

  clone.setAttribute('id', targetId + '-clone');
  clone.classList.add(config.jsHiddenClass);

  return clone;
}

function sliceMobileLink(targetId) {
  // Targeted unordered list and cloned list
  var target = document.getElementById(targetId);
  var clonedTarget = target.cloneNode(true);
  
  // Cloned list items and array conversion
  var targetList = clonedTarget.children;
  var listArr = Array.prototype.slice.call(targetList);

  // The second to last list item and child link being
  // manipulated to pull off the "Back by one" mobile
  // breadcrumb handling
  var breadcrumbList = listArr.slice(-2, -1);
  var breadcrumbLink = breadcrumbList[0].children[0];

  breadcrumbList[0].classList.add(config.mobileClass);
  breadcrumbLink.innerText = breadcrumbLink.innerText.trim();
  breadcrumbLink.removeAttribute('aria-current');
  breadcrumbLink.setAttribute(
    'aria-label',
    `Previous step: ${breadcrumbLink.innerText}`
  );

  return breadcrumbList;
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

var debouncedToggleLinks = _debounce(function(targetId) {
  toggleLinks(targetId);
}, config.triggerDelay);

// Check for breadcrumb on page load
window.addEventListener('DOMContentLoaded', function() {
  buildMobileBreadcrumb(config.containerString, config.listString);
});

// Pause the breadcrumb swap for 500ms
window.addEventListener('resize', function() {
  debouncedToggleLinks(config.listString);
});
