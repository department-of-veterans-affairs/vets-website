/**
 * Adds event handler to move mobile sidebar nav below h1.
 */
const mobileMediaQuery = window.matchMedia('(max-width: 767px)');

export function headerNavSwitch() {
  const header = document.getElementsByTagName('h1')[0];
  const mobileNav = document.querySelector('.va-sidenav');

  if (mobileMediaQuery.matches) {
    header.classList.add('header-transition');
    header.after(mobileNav);
  }
}

document.addEventListener('DOMContentLoaded', headerNavSwitch);
