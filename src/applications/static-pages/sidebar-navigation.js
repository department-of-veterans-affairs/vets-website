/*

@param menuTrigger: One or more elements that have menus attached. Typically
this will be .va-btn-sidebarnav-trigger
*/
import {
  isTab,
  isReverseTab,
  getTabbableElements,
} from '../../platform/utilities/accessibility/';

class SideBarMenu {
  constructor(menuTrigger) {
    this.menuTrigger = Array.from(menuTrigger);
    this.init = this.init.bind(this);
    this.getMenu = this.getMenu.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.captureFocus = this.captureFocus.bind(this);
    this.checkAccordionFocus = this.checkAccordionFocus.bind(this);
    this.findKeyNodes = this.loadKeyNodes.bind(this);
    this.removeListeners = this.removeListeners.bind(this);
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
  captureFocus(e) {
    if (e.target === this.closeControl) {
      if (isReverseTab(e)) {
        e.preventDefault();
        // check if the element is hidden
        if (this.lastTabbableElement.offsetHeight === 0) {
          this.lastAccordionButton.focus();
        } else {
          this.lastTabbableElement.focus();
        }
        // if it is, its nested in an accordion
      }
    }
    if (e.target === this.lastTabbableElement) {
      if (isTab(e)) {
        e.preventDefault();
        this.closeControl.focus();
      }
    }
  }
  checkAccordionFocus(e) {
    if (e.target.getAttribute('aria-expanded') === 'false') {
      if (isTab(e)) {
        e.preventDefault();
        this.closeControl.focus();
      }
    }
  }
  getAccordionButtons(node) {
    return node.querySelectorAll('.usa-accordion-button');
  }
  loadKeyNodes(element) {
    this.menu = document.querySelector(
      `#${element.getAttribute('aria-controls')}`,
    );
    this.tabbableElements = getTabbableElements(this.menu);
    this.accordionButtons = this.getAccordionButtons(this.menu);
    this.lastAccordionButton = this.accordionButtons[
      this.accordionButtons.length - 1
    ];
    this.closeControl = this.tabbableElements[0];
    this.lastTabbableElement = this.tabbableElements[
      this.tabbableElements.length - 1
    ];
  }
  openMenu(trigger) {
    this.loadKeyNodes(trigger);
    this.menu.classList.add('va-sidebarnav--opened');
    this.menu.setAttribute('aria-hidden', 'false');
    document
      .getElementsByClassName('va-btn-sidebarnav-trigger')[0]
      .setAttribute('hidden', 'true');
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.closeMenu(trigger);
    if (trigger.className.includes('va-btn-sidebarnav-trigger')) {
      // main trigger, switch focus to close button
      this.closeControl.focus();
    }
    // capture the focus
    if (this.lastAccordionButton) {
      this.lastAccordionButton.addEventListener(
        'keydown',
        this.checkAccordionFocus,
      );
    }
    this.closeControl.addEventListener('keydown', this.captureFocus);
    this.lastTabbableElement.addEventListener('keydown', this.captureFocus);
  }
  removeListeners() {
    if (this.lastAccordionButton) {
      this.lastAccordionButton.removeEventListener(
        'keydown',
        this.checkAccordionFocus,
      );
    }
    this.closeControl.removeEventListener('keydown', this.captureFocus);
    this.lastTabbableElement.removeEventListener('keydown', this.captureFocus);
  }

  closeMenu() {
    const close = this.menu.querySelector('.va-sidebarnav-close');
    close.addEventListener('click', () => {
      this.menu.classList.remove('va-sidebarnav--opened');
      this.menu.setAttribute('aria-hidden', 'true');
      document.getElementsByTagName('body')[0].style.overflow = 'initial';
      document
        .getElementsByClassName('va-btn-sidebarnav-trigger')[0]
        .removeAttribute('hidden');
      this.removeListeners();
    });
  }
}

export function addActiveState() {
  // Add active state for Drupal-based side nav
  const sideNav = document.querySelector(
    '#va-detailpage-sidebar[data-drupal-sidebar]',
  );
  if (sideNav) {
    const current = document.getElementsByClassName('usa-current')[0];
    const parent = current.closest('.usa-accordion-content')
      .previousElementSibling;
    const ariaExpanded =
      parent.getAttribute('aria-expanded') === 'false' ? 'true' : 'false';
    parent.setAttribute('aria-expanded', ariaExpanded);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-new
  new SideBarMenu(document.querySelectorAll('.va-btn-sidebarnav-trigger'));
});

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-new
  addActiveState();
});
