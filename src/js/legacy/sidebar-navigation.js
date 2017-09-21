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
    this.menuTrigger.map((mt) => {
      mt.addEventListener('click', (domEvent) => {
        this.openMenu(domEvent.currentTarget);
      });
    });
  }      

  getMenu(element) {
    const el = document.querySelector(`#${element.getAttribute('aria-controls')}`);
    this.menu = el;
    return this.menu;
  }

  openMenu(trigger) {
    this.getMenu(trigger).classList.add('va-sidebarnav--opened');
    document.body.classList.add('va-pos-fixed');
    this.closeMenu(trigger);
  }

  closeMenu(trigger) {
    const close = this.menu.querySelector('.va-sidebarnav-close');
    close.addEventListener('click', (domEvent) => {
        this.menu.classList.remove('va-sidebarnav--opened');
        document.body.classList.remove('va-pos-fixed');
    })
  }  
}

document.addEventListener('DOMContentLoaded', () => {
  new SideBarMenu(document.querySelectorAll('.va-btn-sidebarnav-trigger'));
});
