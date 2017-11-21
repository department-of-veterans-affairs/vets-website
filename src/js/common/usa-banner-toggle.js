function initBanner() {

  const toggleButton = document.querySelector('#usa-banner-toggle');

  if (!toggleButton) {
    return;
  }

  const usaHeader = document.querySelector('.usa-banner-header');
  const govBanner = document.querySelector('#gov-banner');

  toggleButton.addEventListener('mouseup', () => {
    const isExpanded = govBanner.getAttribute('aria-hidden') === 'true';

    usaHeader.classList.toggle('usa-banner-header-expanded', isExpanded);
    toggleButton.setAttribute('aria-expanded', isExpanded);
    govBanner.setAttribute('aria-hidden', !isExpanded);
  });
}

document.addEventListener('DOMContentLoaded', initBanner);
