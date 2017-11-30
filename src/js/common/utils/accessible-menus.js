const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;

function isWideScreen() {
  return matchMedia('(min-width: 768px)').matches;
}


/**
 * Finds the closest ancestor for which the callback returns true.
 *
 * @param {HTMLElement}  element
 * @param {function}     testCB   When this returns true on an ancestor, that ancestor is returned
 * @return {HTMLElement|null}     If there is no ansestor for which the test returns true, null is returned
 */
function findNearestAncestor(element, testCB) {
  const parent = element.parentElement;
  if (!parent) {
    return null;
  }
  const returnVal = testCB(parent) ? parent : findNearestAncestor(parent, testCB);
  return returnVal;
}


/**
 * Returns whether the HTMLElement passed is a menu button. This is only true if:
 *  1. The element is a button or has [role="button"]
 *  2. The element has popup
 *  3. The element has aria-controls that contains the id of an element with [role="menu"]
 *
 * @param {HTMLElement} element  The element in question
 * @return {bool}
 */
function isMenuButton(element) {
  // There is no element.getElementById() :matrix:
  const menuElement = element.parentElement.querySelector(`#${element.getAttribute('aria-controls')}`);
  if (!menuElement) {
    return false;
  }

  const menuRole = (menuElement.getAttribute('role') || '').toLowerCase();

  return (element.tagName.toLowerCase() === 'button' || element.getAttribute('role').toLowerCase() === 'button') &&
    ['menu', 'true'].includes(element.getAttribute('aria-haspopup')) &&
    // The menuElement either is or contains a menu element
    !!(menuRole === 'menu' || menuElement.querySelector('[role="menu"]'));
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
 * @param {HTMLLIElement} element  The <li> containing the menu item
 * @param {String} direction     The direction to move the focus. Possible options: 'previous', 'next'
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


/**
 * Gets the menu and associated menu button from an element if possible. Returns null if not.
 *
 * @param {HTMLElement} menuLi  The element (probably <li>) that may contain a menu
 * @return {Object|null}        If the element contains a proper menu structure, returns an object
 *                               { menu: <HTMLElement>, menuButton: <HTMLElement> }
 *                               Otherwise, returns null
 */
function getMenuStructure(menuLi) {
  const menuButton = menuLi.querySelector('button, [role="button"]');
  const menu = menuButton ? menuLi.querySelector(`#${menuButton.getAttribute('aria-controls')}`) : null;

  if (!menuButton || !menu) {
    return null;
  }
  const menuRole = (menu.getAttribute('role') || '').toLowerCase();
  if (!(menuRole === 'menu' || menu.querySelector('[role="menu"]'))) {
    return null;
  }

  return { menuButton, menu };
}


/**
 * Closes a menu.
 *
 * @param {HTMLLIElement} menuLI  The <li> containing the menubutton and menu
 */
function closeMenu(menuLi) {
  // If we're not dealing with a menu structure, abort
  const struct = getMenuStructure(menuLi);
  if (!struct) {
    return;
  }

  const { menuButton, menu } = struct;

  // Close the menu
  menuButton.removeAttribute('aria-expanded');
  menu.setAttribute('hidden', 'hidden');
}


/**
 * Opens a menu.
 *
 * @param {HTMLLIElement} menuLi  The <li> containing the menubutton and menu
 */
function openMenu(menuLi, openSubMenu = false, stealFocus = true) {
  // If we're not dealing with a menu structure, abort
  const struct = getMenuStructure(menuLi);
  if (!struct) {
    return;
  }

  const { menuButton, menu } = struct;

  // First, close all sibling menus
  const openMenus = menu.parentElement.querySelectorAll('[aria-expanded=true]');
  openMenus.forEach(m => closeMenu(m.parentElement));

  // Open the menu
  menuButton.setAttribute('aria-expanded', true);
  menu.removeAttribute('hidden');

  if (stealFocus) {
    const menuRole = (menu.getAttribute('role') || '').toLowerCase();
    const firstMenuItem = menuRole === 'menu' ? menu.firstElementChild : menu.querySelector('[role="menu"] > li');
    firstMenuItem.firstElementChild.focus();
  }

  // If we're wide-screen, open the first submenu
  if (openSubMenu) {
    openMenu(menu.firstElementChild, false, false);
  }
}


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
          event.preventDefault();
          closeMenu(targetLi);
          moveFocus(targetLi, 'previous');
        } else if (isMenuButton(event.target)) {
          event.preventDefault();
          // Move focus to the opening menu button
        }
        break;
      }

      case RIGHT_ARROW: {
        if (inMenubar) {
          event.preventDefault();
          closeMenu(targetLi);
          moveFocus(targetLi, 'next');
        } else if (isMenuButton(event.target)) {
          event.preventDefault();
          // Open the menu, focus on the first item
        }
        break;
      }

      case UP_ARROW: {
        const isMB = isMenuButton(event.target);
        const inMenu = (targetLi.parentElement.getAttribute('role') || '').toLowerCase() === 'menu';
        if (inMenubar && isMB) {
          // Open the menu, focus on the last item
          event.preventDefault();

          // Only open the first menu; we'll manually open the next level
          openMenu(targetLi);

          if (isWideScreen()) {
            // `[role="menu"] > li:last-child` was acting more like `[role="menu"] > li :last-child`, so we're
            //  doing it the hard way
            const menuItems = targetLi.querySelector('[role="menu"]').children;
            const lastSubmenu = menuItems[menuItems.length - 1];
            openMenu(lastSubmenu, false, false);
            lastSubmenu.firstElementChild.focus();
          }
        } else if (inMenu) {
          event.preventDefault();
          // If we've reached the top of a list, figure out if we need to go up a level or wrap around
          if (targetLi.previousElementSibling === null) {
            const firstLi = findNearestAncestor(targetLi, el => {
              return el.tagName.toLowerCase() === 'li';
            });

            // If the first <li> ancestor is in a [role="menubar"], we're at the first submenu and should
            //  go up to the top-level menubar item
            if (firstLi && (firstLi.parentElement.getAttribute('role') || '') === 'menubar') {
              firstLi.firstElementChild.focus();
            } else {
              moveFocus(targetLi, 'previous');
            }
          } else {
            moveFocus(targetLi, 'previous');
          }
        }
        break;
      }

      case DOWN_ARROW: {
        const isMB = isMenuButton(event.target);
        const inMenu = (targetLi.parentElement.getAttribute('role') || '').toLowerCase() === 'menu';
        if (inMenubar && isMB) {
          event.preventDefault();
          openMenu(targetLi, isWideScreen());
        } else if (inMenu) {
          event.preventDefault();
          moveFocus(targetLi, 'next');
        }
        break;
      }
      // TODO: escape

      default: break;
    }
  });

  // TODO: Add listener for loss of focus for if we tab away from an open menu

  // menuElement.addEventListener('click', (event) => {
  //   // Handle opening menus 'n stuff
  // });
}

