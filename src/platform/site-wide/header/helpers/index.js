export const hideLegacyHeader = () => {
  // Derive the legacy header.
  const legacyHeader = document.getElementById('legacy-header');

  // Escape early if the legacy header doesn't exist.
  if (!legacyHeader) {
    return;
  }

  // Add `vads-u-display--none` to the legacy header if it doesn't already have it.
  if (!legacyHeader.classList.contains('vads-u-display--none')) {
    legacyHeader.classList.add('vads-u-display--none');
  }
};

export const showLegacyHeader = () => {
  // Derive the legacy header.
  const legacyHeader = document.getElementById('legacy-header');

  // Escape early if the legacy header doesn't exist.
  if (!legacyHeader) {
    return;
  }

  // Add `vads-u-display--none` to the legacy header if it doesn't already have it.
  if (legacyHeader.classList.contains('vads-u-display--none')) {
    legacyHeader.classList.remove('vads-u-display--none');
  }
};
