export const hideDefaultBanner = () => {
  // Derive the default banner on the page.
  const defaultBanner = document.querySelector('div[id="vets-banner-1"]');

  // Escape early if the default banner doesn't exist.
  if (!defaultBanner) {
    return;
  }

  // Add `vads-u-display--none` class to the default banner if it doesn't already exist.
  if (!defaultBanner.classList.contains('vads-u-display--none')) {
    defaultBanner.classList.add('vads-u-display--none');
  }
};

export const showDefaultBanner = () => {
  // Derive the default banner on the page.
  const defaultBanner = document.querySelector('div[id="vets-banner-1"]');

  // Escape early if the default banner doesn't exist.
  if (!defaultBanner) {
    return;
  }

  // Add `vads-u-display--none` class to the default banner if it doesn't already exist.
  if (defaultBanner.classList.contains('vads-u-display--none')) {
    defaultBanner.classList.remove('vads-u-display--none');
  }
};
