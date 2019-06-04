/*
First accordion item open by default
*/

export function openFirstLeftNavItem(sidenav) {
  const accordion = sidenav.getElementsByClassName('usa-accordion');

  // get the path and see if we're on a root level page
  const location = window.location.pathname;
  const pathArray = location.split('/');
  const filteredPathArray = pathArray.filter(Boolean);

  if (
    filteredPathArray.length === 1 ||
    (filteredPathArray.indexOf('index.html') > 0 &&
      filteredPathArray.length <= 2)
  ) {
    if (accordion.length > 0) {
      // get the accordion inside the side nav
      const usaAccordion = accordion[0];

      // get the first accordion panel and it's content
      const firstPanelToggle = usaAccordion.querySelector(
        '.usa-accordion-button',
      );
      const firstPanelContent = usaAccordion.querySelector(
        '.usa-accordion-content',
      );

      // check if first panel is expanded and if it's not expand it
      const isExpanded = firstPanelToggle.getAttribute('aria-expanded');
      if (isExpanded === 'false') {
        firstPanelToggle.setAttribute('aria-expanded', 'true');
        firstPanelContent.setAttribute('aria-hidden', 'false');
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const sideNav = document.getElementById('va-detailpage-sidebar');
  if (sideNav) {
    openFirstLeftNavItem(sideNav);
  }
});
