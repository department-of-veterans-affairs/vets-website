class MegaMenu {
  constructor(element) {
    this.element = element;
    this.addListeners = this.addListeners.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleSubMenu = this.toggleSubMenu.bind(this);
    this.closeAll = this.closeAll.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.getMenu = this.getMenu.bind(this);
    this.isWideScreen = this.isWideScreen.bind(this);
    this.addListeners();
  }

  addListeners() {
    const menus = Array.from(this.element.querySelectorAll('.vetnav-level1'));
    const submenus = Array.from(this.element.querySelectorAll('.vetnav-level2'));
    const backs = Array.from(this.element.querySelectorAll('.vetnav-back'));
   
    menus.forEach((menu) => {
      menu.addEventListener('click', this.toggleMenu);
    });

    submenus.forEach((submenu) => {
      submenu.addEventListener('click', this.toggleSubMenu);
    });

    backs.forEach((back) => {
      back.addEventListener('click', this.closeMenu);
    });
  }

  closeAll() {
    const menus = this.element.querySelectorAll('[aria-expanded=true]');
    Array.from(menus).forEach((m) => {
      const whichMenu = this.getMenu(m.getAttribute('aria-controls'));
      whichMenu.setAttribute('hidden','hidden');
      m.setAttribute('aria-expanded', false);
    });
  }

  closeMenu(event) {
    const target = event.target;
    const menu = target.getAttribute('aria-controls');

    target.setAttribute('aria-expanded', false);
    this.getMenu(target.getAttribute('aria-controls')).setAttribute('hidden','hidden');
  }

  getMenu(idName) {
    const selector = `#${idName}`;
    return this.element.querySelector(selector);
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

    if(eTarget.getAttribute('aria-expanded') == 'true') {
      this.closeMenu(event);
    } else {
      this.closeAll();
      this.openMenu(event);

      /*
      Open the first sub-menu and expand first trigger 
      when the breakpoint > 768
      */
      if(matchMedia('(min-width: 768px)').matches && whichMenu.querySelector('.vetnav-panel--submenu')){
        whichMenu.querySelector('.vetnav-trigger').setAttribute('aria-expanded', true);
        whichMenu.querySelector('.vetnav-panel--submenu').removeAttribute('hidden');
      }
    }
  }

  toggleSubMenu(event) {
    const submenus = Array.from(this.element.querySelectorAll('.vetnav-panel--submenu'));
    const triggers = Array.from(this.element.querySelectorAll('.vetnav-level2'));

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
  }
}

export default MegaMenu;

function toggleMobileMenu(event) {
  const toggleNav = event.currentTarget.querySelectorAll('button');
  const menu = document.querySelector('#vetnav');

  Array.from(toggleNav).forEach((tn) => {
    if( tn.hidden ) {
      tn.removeAttribute('hidden');
    } else {
      tn.setAttribute('hidden','hidden');
    }
  });

  if( menu.hidden ) {
    menu.removeAttribute('hidden');
  } else {
    menu.setAttribute('hidden','hidden');
  }

  // Make the document body unscrollable when menu is open
  document.body.classList.toggle('va-pos-fixed');
}

document.addEventListener('DOMContentLoaded', () => {
  const mm = new MegaMenu(document.querySelector('#vetnav-menu'));
  
  if(mm.isWideScreen()) {
    document.querySelector('#vetnav').removeAttribute('hidden');
  } else {
    document.querySelector('#vetnav-controls').addEventListener('click', toggleMobileMenu);
  }
});

