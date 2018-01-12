import { isWideScreen, isEscape, isReverseTab, isTab } from '../common/utils/accessible-menus';

class MegaMenu {
  constructor(menuElement, openMenuElement, closeMenuElement) {
    this.menu = menuElement;
    this.closeControl = closeMenuElement;
    this.openControl = openMenuElement;
    this.menuElements = this.menu.children[0].children;
    this.firstMenuElement = this.menuElements[0].children[0];
    this.lastMenuElement = this.menuElements[this.menuElements.length - 1].children[0];
    this.lastTabbableElement = document.querySelector('[href="http://usa.gov"]'); 
    this.addListeners = this.addListeners.bind(this);
    this.resetMenu = this.resetMenu.bind(this);
    this.showMegaMenu = this.showMegaMenu.bind(this);
    this.hideMegaMenu = this.hideMegaMenu.bind(this);
    this.enterSmallMegaMenu = this.enterSmallMegaMenu.bind(this);
    this.exitSmallMegaMenu = this.exitSmallMegaMenu.bind(this);
    this.toggleSmallMegaMenu = this.toggleSmallMegaMenu.bind(this);

    this.addListeners();
  }

  addListeners() {
    this.closeControl.addEventListener('click', this.hideMegaMenu);
    this.closeControl.addEventListener('keydown', this.enterSmallMegaMenu);
    this.openControl.addEventListener('click', this.showMegaMenu);
    this.firstMenuElement.addEventListener('keydown', this.exitSmallMegaMenu);
    this.lastMenuElement.addEventListener('keydown', this.exitSmallMegaMenu);
    this.menu.addEventListener('keydown', this.toggleSmallMegaMenu);
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

  toggleSmallMegaMenu(e) {
    if (e.target.nodeName === 'LI' && !isWideScreen() && isEscape(e)) {
      this.hideMegaMenu();
      this.openControl.focus();
    }
  }

  enterSmallMegaMenu(e) {
    if (!isWideScreen() && isTab(e)) {
      e.preventDefault();
      this.firstMenuElement.focus();
    }
  }

  exitSmallMegaMenu(e) {
    if(e.target === this.firstMenuElement){
      if (!isWideScreen() && isReverseTab(e)) {
        e.preventDefault();
        this.closeControl.focus();
      }
    }
    if(e.target === this.lastMenuElement){
      if (!isWideScreen() && isTab(e)) {
        this.lastTabbableElement.focus();
      }
    }
  }
}

export default MegaMenu;

function initNavMenu() {
  const menuElement = document.querySelector('#vetnav');
  const openMenuElement = document.querySelector('.vetnav-controller-open');
  const closeMenuElement = document.querySelector('.vetnav-controller-close');

  const mm = new MegaMenu(menuElement, openMenuElement, closeMenuElement);
  mm.resetMenu();
}

document.addEventListener('DOMContentLoaded', initNavMenu);
