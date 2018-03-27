const config = {
  jsHiddenClass: 'js-hide',
  jsVisualClass: 'js-visual',
  mobileClass: 'va-nav-breadcrumbs-list__mobile-link',
  triggerDelay: 500,
  triggerWidth: 425,
};

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
  const clone = target.cloneNode();

  clone.setAttribute('id', `${targetId}-clone`);
  clone.classList.add(config.jsHiddenClass);

  return clone;
}

function sliceMobileLink(targetId) {
  const target = document.getElementById(targetId);
  const clonedTarget = target.cloneNode(true);
  const targetList = clonedTarget.children;

  const listArr = Array.prototype.slice.call(targetList);

  const breadcrumbLink = listArr.slice(-2, -1);
  const textString = breadcrumbLink[0].children[0].innerText.trim();

  breadcrumbLink[0].classList.add(config.mobileClass);
  breadcrumbLink[0].children[0].innerText = textString;
  breadcrumbLink[0].children[0].setAttribute(
    'aria-label',
    `Previous step: ${textString.trim()}`
  );

  return breadcrumbLink;
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

export function buildMobileBreadcrumb(parentId, targetId) {
  console.log('called buildMobileBreadcrumb');
  const container = document.getElementById(parentId);
  const target = document.getElementById(targetId);

  const clonedList = cloneList(target, targetId);
  const mobileLink = sliceMobileLink(targetId);

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

  // Add aria-current attribute to last standard link
  addAriaCurrent(`#${targetId} li`);

  // Reveal the correct breadcrumb list
  container.classList.remove(config.jsVisualClass);
}

export const debouncedToggleLinks = _debounce(targetId => {
  toggleLinks(targetId);
}, config.triggerDelay);
