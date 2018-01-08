import { isWideScreen, isEscape } from '../common/utils/accessible-menus';

class MegaMenu {
  constructor(menuElement, openMenuElement, closeMenuElement, menuElements) {
    this.menu = menuElement;
    this.closeControl = closeMenuElement;
    this.openControl = openMenuElement;
    this.menuElements = menuElements;
    this.firstMenuElement = this.menuElements[0].getElementsByTagName('a')[0];
    this.addListeners = this.addListeners.bind(this);
    this.resetMenu = this.resetMenu.bind(this);
    this.showMegaMenu = this.showMegaMenu.bind(this);
    this.hideMegaMenu = this.hideMegaMenu.bind(this);
    this.exitSmallMegaMenu = this.exitSmallMegaMenu.bind(this);

    this.addListeners();
  }

  addListeners() {
    this.closeControl.addEventListener('click', this.hideMegaMenu);
    this.openControl.addEventListener('click', this.showMegaMenu);
    this.menuElements.forEach(item => item.addEventListener('keydown', this.exitSmallMegaMenu));
    window.addEventListener('resize', this.resetMenu);
  }

  resetMenu() {
    if (isWideScreen()) {
      // this.closeAll();
      this.showMegaMenu();
    } else {
      this.hideMegaMenu();
    }
  }

  showMegaMenu() {
    this.openControl.setAttribute('hidden', 'hidden');
    this.menu.removeAttribute('hidden');
    this.closeControl.removeAttribute('hidden');
    if (!isWideScreen()) {
      this.firstMenuElement.focus();
    }
  }

  hideMegaMenu() {
    this.closeControl.setAttribute('hidden', 'hidden');
    this.menu.setAttribute('hidden', 'hidden');
    this.openControl.removeAttribute('hidden');
    this.menu.classList.remove('vetnav--submenu-expanded');
  }

  exitSmallMegaMenu(e) {
    if (!isWideScreen() && isEscape(e)) {
      this.hideMegaMenu();
      this.openControl.focus();
    }
  }

}

export default MegaMenu;

function initNavMenu() {
  const menuElement = document.querySelector('#vetnav');
  const openMenuElement = document.querySelector('.vetnav-controller-open');
  const closeMenuElement = document.querySelector('.vetnav-controller-close');
  const menuElements = document.querySelectorAll('#vetnav-menu li');

  const mm = new MegaMenu(menuElement, openMenuElement, closeMenuElement, menuElements);
  mm.resetMenu();
}

document.addEventListener('DOMContentLoaded', initNavMenu);
