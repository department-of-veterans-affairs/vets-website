/*

@param menuTrigger: One or more elements that have menus attached. Typically
this will be .va-btn-sidebarnav-trigger
*/

class SideBarMenu {
  constructor(menuTrigger) {
    this.menuTrigger = Array.from(menuTrigger);
    this.init = this.init.bind(this);
    this.getMenu = this.getMenu.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.menu = null;
    this.init();
  }

  init() {
    this.menuTrigger.forEach(mt => {
      mt.addEventListener('click', domEvent => {
        this.openMenu(domEvent.currentTarget);
      });
    });
  }

  getMenu(element) {
    const el = document.querySelector(
      `#${element.getAttribute('aria-controls')}`,
    );
    this.menu = el;
    return this.menu;
  }

  openMenu(trigger) {
    this.getMenu(trigger).classList.add('va-sidebarnav--opened');
    document
      .getElementsByClassName('va-btn-sidebarnav-trigger')[0]
      .setAttribute('hidden', 'true');
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.closeMenu(trigger);
  }

  closeMenu() {
    const close = this.menu.querySelector('.va-sidebarnav-close');
    close.addEventListener('click', () => {
      this.menu.classList.remove('va-sidebarnav--opened');
      document.getElementsByTagName('body')[0].style.overflow = 'initial';
      document
        .getElementsByClassName('va-btn-sidebarnav-trigger')[0]
        .removeAttribute('hidden');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-new
  new SideBarMenu(document.querySelectorAll('.va-btn-sidebarnav-trigger'));
});
