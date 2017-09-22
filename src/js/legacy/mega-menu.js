class MegaMenu {
  constructor(menuElement, openMenuElement, closeMenuElement) {
    this.menu = menuElement;
    this.closeAll = this.closeAll.bind(this);
    this.closeControl = closeMenuElement;
    this.closeMenu = this.closeMenu.bind(this);
    this.addListeners = this.addListeners.bind(this);
    this.getMenu = this.getMenu.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
    this.isWideScreen = this.isWideScreen.bind(this);
    this.openControl = openMenuElement;
    this.openMenu = this.openMenu.bind(this);
    this.resetMenu = this.resetMenu.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleSubMenu = this.toggleSubMenu.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);

    this.addListeners();
  }

  addListeners() {
    const menus = Array.from(this.menu.querySelectorAll('.vetnav-level1'));
    const submenus = Array.from(this.menu.querySelectorAll('.vetnav-level2'));
    const backs = Array.from(this.menu.querySelectorAll('.vetnav-back'));

    menus.forEach((menu) => {
      menu.addEventListener('click', this.toggleMenu);

      const dropdown = this.getMenu(menu.getAttribute('aria-controls'));

      if (dropdown) {
        dropdown.addEventListener('click', (event) => event.stopPropagation());
      }
    });

    submenus.forEach((submenu) => {
      submenu.addEventListener('click', this.toggleSubMenu);
    });

    backs.forEach((back) => {
      back.addEventListener('click', this.closeMenu);
    });

    this.openControl.addEventListener('click', this.showMenu);
    this.closeControl.addEventListener('click', this.hideMenu);

    document.addEventListener('click', this.handleDocumentClick);
    window.addEventListener('resize', this.resetMenu);
  }

  handleDocumentClick(event) {
    const target = event.target;
    if (!target.classList.contains('vetnav-level1')) {
      this.closeAll();
    }
  }

  closeAll() {
    const menus = this.menu.querySelectorAll('[aria-expanded=true]');
    Array.from(menus).forEach((m) => {
      const whichMenu = this.getMenu(m.getAttribute('aria-controls'));
      whichMenu.setAttribute('hidden','hidden');
      m.setAttribute('aria-expanded', false);
    });
  }

  closeMenu(event) {
    const target = event.target;
    const dropdown = this.getMenu(target.getAttribute('aria-controls'));

    event.stopPropagation();
    target.setAttribute('aria-expanded', false);
    dropdown.setAttribute('hidden', 'hidden');
    
    this.menu.classList.remove('vetnav--submenu-expanded');
  }

  getMenu(idName) {
    const selector = `#${idName}`;
    return this.menu.querySelector(selector);
  }

  isWideScreen() {
    return matchMedia('(min-width: 768px)').matches;
  }

  openMenu(event) {
    const target = event.target;
    const menu = target.getAttribute('aria-controls');

    target.setAttribute('aria-expanded', true);
    this.getMenu(menu).removeAttribute('hidden','hidden');
  }

  toggleMenu(event) {
    const eTarget = event.target;
    const whichMenu = this.getMenu(eTarget.getAttribute('aria-controls'));

    if(eTarget.getAttribute('aria-expanded') === 'true') {
      this.closeMenu(event);

    } else {
      this.closeAll();
      this.openMenu(event);

      /*
      Open the first sub-menu and expand first trigger
      when the breakpoint > 768
      */
      if(this.isWideScreen() && whichMenu.querySelector('.vetnav-panel--submenu')){
        whichMenu.querySelector('.vetnav-trigger').setAttribute('aria-expanded', true);
        whichMenu.querySelector('.vetnav-panel--submenu').removeAttribute('hidden');
      }
    }
  }

  toggleSubMenu(event) {
    const submenus = Array.from(this.menu.querySelectorAll('.vetnav-panel--submenu'));
    const triggers = Array.from(this.menu.querySelectorAll('.vetnav-level2'));

    event.stopPropagation();

    submenus.forEach((sm) => {
      sm.setAttribute('hidden','hidden');
    });

    triggers.forEach((sm) => {
      sm.setAttribute('aria-expanded', false);
    });

    const showCurrent = submenus.find((sm) => {
      return sm.id == event.target.getAttribute('aria-controls');
    });

    showCurrent.removeAttribute('hidden');
    event.target.setAttribute('aria-expanded', true);
    
    this.menu.classList.add('vetnav--submenu-expanded');
  }

  resetMenu() {
    if(this.isWideScreen()) {
      this.closeAll();
      this.showMenu();
    } else {
      this.hideMenu();
    }
    document.body.classList.remove('va-pos-fixed');
  }

  showMenu() {
    document.body.classList.add('va-pos-fixed');
    this.openControl.setAttribute('hidden','hidden');
    this.menu.removeAttribute('hidden');
    this.closeControl.removeAttribute('hidden');
  }

  hideMenu() {
    document.body.classList.remove('va-pos-fixed');
    this.closeControl.setAttribute('hidden','hidden');
    this.menu.setAttribute('hidden','hidden');
    this.openControl.removeAttribute('hidden');
    this.menu.classList.remove('vetnav--submenu-expanded');
  }
}

export default MegaMenu;

function reInitMenu() {
  const menuElement = document.querySelector('#vetnav');
  const openMenuElement = document.querySelector('.vetnav-controller-open');
  const closeMenuElement = document.querySelector('.vetnav-controller-close');

  const mm = new MegaMenu(menuElement, openMenuElement, closeMenuElement);
  mm.resetMenu();
}

document.addEventListener('DOMContentLoaded', reInitMenu);
