export const hideLegacyEvents = () => {
  // Derive the legacy events page.
  const legacyEvents = document.querySelector(
    'div[data-template="event_listing.drupal.liquid"]',
  );

  // Escape early if the legacy events page doesn't exist.
  if (!legacyEvents) {
    return;
  }

  // Add `vads-u-display--none` to the legacy events page if it doesn't already have it.
  if (!legacyEvents.classList.contains('vads-u-display--none')) {
    legacyEvents.classList.add('vads-u-display--none');
  }
};

export const showLegacyEvents = () => {
  // Derive the legacy events page.
  const legacyEvents = document.querySelector(
    'div[data-template="event_listing.drupal.liquid"]',
  );

  // Escape early if the legacy events page doesn't exist.
  if (!legacyEvents) {
    return;
  }

  // Add `vads-u-display--none` to the legacy events page if it doesn't already have it.
  if (legacyEvents.classList.contains('vads-u-display--none')) {
    legacyEvents.classList.remove('vads-u-display--none');
  }
};
