function cloneList(target, targetId) {
  const clone = target.cloneNode();

  clone.setAttribute('id', `${targetId}-clone`);
  clone.classList.add('js-hide');

  return clone;
}

function sliceMobileLink(targetId) {
  const target = document.getElementById(targetId);
  const clonedTarget = target.cloneNode(true);
  const targetList = clonedTarget.children;

  const listArr = Array.prototype.slice.call(targetList);

  const breadcrumbLink = listArr.slice(-1);
  breadcrumbLink[0].classList.add('va-nav-breadcrumbs-list__mobile-link');

  return breadcrumbLink;
}

export function toggleLinks(targetId) {
  const breadcrumb = document.getElementById(targetId);
  const clone = document.getElementById(`${targetId}-clone`);

  if (window.innerWidth <= 425) {
    breadcrumb.classList.add('js-hide');
    clone.classList.remove('js-hide');
  } else {
    clone.classList.add('js-hide');
    breadcrumb.classList.remove('js-hide');
  }
}

export function buildMobileBreadcrumb(parentId, targetId) {
  const container = document.getElementById(parentId);
  const target = document.getElementById(targetId);

  const clonedList = cloneList(target, targetId);
  const mobileLink = sliceMobileLink(targetId);

  target.classList.add('js-hide');

  mobileLink.map(item => {
    return clonedList.appendChild(item);
  });

  container.appendChild(clonedList);

  if (window.innerWidth <= 425) {
    clonedList.classList.remove('js-hide');
  } else {
    target.classList.remove('js-hide');
  }
}
