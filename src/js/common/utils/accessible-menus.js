const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;

function isMenuButton(element) {
  return (element.tagName.toLowerCase() === 'button' || element.getAttribute('role').toLowerCase() === 'button') &&
    element.getAttribute('aria-haspopup') &&
    // Next element is a menu
    // TODO: Should go by whether the element that aria-controls points to is a menu
    element.nextElementSibling.getAttribute('role').toLowerCase() === 'menu';
}

/**
 * Determines if an element is visible by checking both its display and at least one of its children's
 *  display is neither hidden nor none. Only goes one level deep.
 *
 * @param {HTMLElement} element  The element to determine the visibility of
 */
function isVisible(element) {
  const hiddenDisplays = ['hidden', 'none'];
  const visible = !hiddenDisplays.includes(getComputedStyle(element).display) &&
    Array.from(element.children).some(e => !hiddenDisplays.includes(getComputedStyle(e).display));
  return visible;
}

/**
 * Focuses on either the previous or next element in a list. If either the beginning or end of the list
 *  is reached, it wraps to the last or first element respectively. If an element isn't visible, it's
 *  skipped.
 *
 * @param {HTMLElement} element  The <li> containing the menu item
 */
function moveFocus(element, direction) {
  const focusElement = direction === 'previous' ?
    (element.previousElementSibling || element.parentNode.lastElementChild) :
    (element.nextElementSibling || element.parentNode.firstElementChild);

  // If focusElement isn't visible, recurse
  if (!isVisible(focusElement)) {
    moveFocus(focusElement, direction);
  } else {
    // The focusElement should be a <li>, so we want to focus on the contents
    focusElement.firstElementChild.focus();
  }
}

// function openMenu() {}

// function openSubmenu() {}

/**
 * Attaches event listeners to a menu or menu bar to make it keyboard navigable.
 * 
 * If the mobile buttons are provided, this will also handle the opening and closing
 *  of the menu on small screens when there's just a "Menu" button.
 *
 * @param {HTMLElement} menuElement        A menubar or menu
 * @param {HTMLElement} mobileOpenButton   Optional - The "Menu" button on mobile
 * @param {HTMLElement} mobileCloseButton  Optional - The "Close" button on mobile
 */
export default function addMenuListeners(menuElement) {
  const menuRole = menuElement.getAttribute('role');
  if (!['menubar', 'menu'].includes(menuRole)) {
    // If we don't have a menubar or menu, don't continue
    return;
  }


  // For all the sub menus, add listeners for:
  //  Up, down, left, right, enter (if necessary), space (if necessary)
  menuElement.addEventListener('keydown', (event) => {
    const targetLi = event.target.parentElement;
    // Target's grandparent because the parent is a <li>
    const inMenubar = targetLi.parentElement.getAttribute('role').toLowerCase() === 'menubar';
    switch (event.keyCode) {
      case LEFT_ARROW: {
        if (inMenubar) {
          moveFocus(targetLi, 'previous');
          // TODO: Close the menu
        } else if (isMenuButton(targetLi)) {
          // Move focus to the opening menu button
        }
        break;
      }
      case RIGHT_ARROW: {
        if (inMenubar) {
          // Move focus to the next item
          moveFocus(targetLi, 'next');
          // TODO: Close the menu
        } else if (isMenuButton(targetLi)) {
          // Open the menu, focus on the first item
        }

        break;
      }
      case UP_ARROW: {
        const isMB = isMenuButton(targetLi);
        if (inMenubar && isMB) {
          // Open the menu, focus on the last item
        } else if (isMB) {
          // Move focus to the previous sibling
        }
        break;
      }
      case DOWN_ARROW: {
        const isMB = isMenuButton(targetLi);
        if (inMenubar && isMB) {
          // Open the menu, focus on the first item
        } else if (isMB) {
          // Move focus to the next sibling
        }
        break;
      }
      // TODO: escape, enter (maybe), space (maybe)
      default: break;
    }
  });

  // menuElement.addEventListener('click', (event) => {
  //   // Handle opening menus 'n stuff
  // });
}

