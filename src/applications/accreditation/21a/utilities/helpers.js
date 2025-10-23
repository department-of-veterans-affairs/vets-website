const HEADER_IDS = {
  LEGACY: 'legacy-header',
  DEFAULT: 'header-default',
  MINIMAL: 'header-minimal',
  MOBILE: 'mobile-header',
};

/**
 * Removes default headers from the DOM if they exist.
 */
export const removeDefaultHeaders = () => {
  Object.values(HEADER_IDS).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.remove();
    }
  });
};
