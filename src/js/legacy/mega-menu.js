function isWideScreen() {
  return matchMedia('(min-width: 768px)').matches;
}

class MegaMenu {
  constructor(menuElement, openMenuElement, closeMenuElement) {
    this.menu = menuElement;
    this.closeControl = closeMenuElement;
    this.openControl = openMenuElement;
    this.addListeners = this.addListeners.bind(this);
    this.resetMenu = this.resetMenu.bind(this);
    this.showMegaMenu = this.showMegaMenu.bind(this);
    this.hideMegaMenu = this.hideMegaMenu.bind(this);

    this.addListeners();
  }

  addListeners() {
    this.closeControl.addEventListener('click', this.hideMegaMenu);
    this.openControl.addEventListener('click', this.showMegaMenu);
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
  }

  hideMegaMenu() {
    this.closeControl.setAttribute('hidden', 'hidden');
    this.menu.setAttribute('hidden', 'hidden');
    this.openControl.removeAttribute('hidden');
    this.menu.classList.remove('vetnav--submenu-expanded');
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
