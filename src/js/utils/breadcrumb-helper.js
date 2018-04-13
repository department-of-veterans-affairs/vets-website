const config = {
  jsHiddenClass: 'js-hide',
  jsVisualClass: 'js-visual',
  mobileClass: 'va-nav-breadcrumbs-list__mobile-link',
  triggerDelay: 500,
  triggerWidth: 425,
};

/**
 * ========================================
 * HELPER METHODS
 * ========================================
 */

// https://davidwalsh.name/javascript-debounce-function
function _debounce(func, wait, immediate) {
  // Time to wait in milliseconds
  let timeout;

  return (...args) => {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;

    // Clear any existing timeouts
    clearTimeout(timeout);

    // Execute after timeout period
    timeout = setTimeout(later, wait);

    // If callNow evaluates true, execute immediately
    // Not recommended for resource-intensive events like resize
    if (callNow) {
      func.apply(this, args);
    }
  };
}

// Used to check for the existence of a cloned breadcrumb
// when the cloneList method is invoked. Otherwise we
// end up with multiple clones.
function _isElement(el) {
  return el instanceof Element;
}

/**
 * ========================================
 * INTERNAL METHODS
 * ========================================
 */
function addAriaCurrent(targetList) {
  const listItems = document.querySelectorAll(targetList);
  const listArr = Array.prototype.slice.call(listItems);
  const singleLink = listArr.slice(-1)[0].children;

  listArr.map(item => {
    return item.children[0].removeAttribute('aria-current');
  });

  singleLink[0].setAttribute('aria-current', 'page');
}

function cloneList(target, targetId) {
  const removedClone = document.getElementById(`${targetId}-clone`);

  if (_isElement(removedClone)) {
    removedClone.parentNode.removeChild(removedClone);
  }

  const clone = target.cloneNode();

  clone.setAttribute('id', `${targetId}-clone`);
  clone.classList.add(config.jsHiddenClass);

  return clone;
}

function sliceMobileLink(targetId) {
  // Targeted unordered list and cloned list
  const target = document.getElementById(targetId);
  const clonedTarget = target.cloneNode(true);

  // Cloned list items and array conversion
  const targetList = clonedTarget.children;
  const listArr = Array.prototype.slice.call(targetList);

  // The second to last list item and child link being
  // manipulated to pull off the "Back by one" mobile
  // breadcrumb handling
  const breadcrumbList = listArr.slice(-2, -1);
  const breadcrumbLink = breadcrumbList[0].children[0];

  breadcrumbList[0].classList.add(config.mobileClass);
  breadcrumbLink.textContent = breadcrumbLink.textContent.trim();
  breadcrumbLink.removeAttribute('aria-current');
  breadcrumbLink.setAttribute(
    'aria-label',
    `Previous step: ${breadcrumbLink.textContent}`
  );

  return breadcrumbList;
}

function toggleLinks(targetId) {
  const breadcrumb = document.getElementById(targetId);
  const clone = document.getElementById(`${targetId}-clone`);

  if (window.innerWidth <= config.triggerWidth) {
    breadcrumb.classList.add(config.jsHiddenClass);
    clone.classList.remove(config.jsHiddenClass);
  } else {
    clone.classList.add(config.jsHiddenClass);
    breadcrumb.classList.remove(config.jsHiddenClass);
  }
}

/**
 * ========================================
 * EXPORTED METHOD & CONST
 * 
 * The exported const debouncedToggleLinks
 * is a way to listen for resize events,
 * and delay the class toggles by 500ms,
 * per the triggerDelay key in the
 * config object at the top of the scrip
 * ========================================
 */
export function buildMobileBreadcrumb(parentId, targetId) {
  const container = document.getElementById(parentId);
  const target = document.getElementById(targetId);

  const clonedList = cloneList(target, targetId);
  const mobileLink = sliceMobileLink(targetId);

  // Hide the original breadcrumb, because we have to
  // decide page width first, then determine which
  // breadcrumb to show.
  target.classList.add(config.jsHiddenClass);

  // Add aria-current attribute to last standard link
  addAriaCurrent(`#${targetId} li`);

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

  // Reveal the correct breadcrumb list by removing
  // our .js-visibility { visibility: hidden; } class
  container.classList.remove(config.jsVisualClass);
}

// Ready access to the debounced toggleLinks method. This
// gives us a sure way to listen for resize, and not be
// adding or removing classes without a reasonable delay.
// Saves CPU resources and offers a smoother user experience.
export const debouncedToggleLinks = _debounce(targetId => {
  toggleLinks(targetId);
}, config.triggerDelay);
