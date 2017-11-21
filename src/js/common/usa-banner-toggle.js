function initBanner() {

  const toggleButton = document.querySelector('#usa-banner-toggle');

  if (!toggleButton) {
    return;
  }

  const usaHeader = document.querySelector('.usa-banner-header');
  const govBanner = document.querySelector('#gov-banner');

  toggleButton.addEventListener('mouseup', (event) => {

    let [ariaExpanded, ariaHidden] = ['true', 'false'];

    if (govBanner.getAttribute('aria-hidden') == 'false') {
      [ariaExpanded, ariaHidden] = [ariaHidden, ariaExpanded];
    }

    toggleButton.setAttribute('aria-expanded', ariaExpanded);
    govBanner.setAttribute('aria-hidden', ariaHidden);
    usaHeader.classList.toggle('usa-banner-header-expanded', ariaExpanded == 'true');
  });
}

document.addEventListener('DOMContentLoaded', initBanner);
