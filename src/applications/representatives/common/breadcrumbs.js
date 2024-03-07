const breadcrumbPaths = {
  dashboard: [
    { link: '/', label: 'Home' },
    { link: '/dashboard', label: 'Dashboard' },
  ],
  permissions: [
    { link: '/', label: 'Home' },
    { link: '/permissions', label: 'Permissions' },
  ],
  'poa-requests': [
    { link: '/', label: 'Home' },
    { link: '/poa-requests', label: 'POA requests' },
  ],
};

/**
 * Function takes a page name and returns an array of breadcrumbs for that page
 *
 * @param {string} page
 * @returns {Array}
 */

export const poaBreadcrumbs = page =>
  breadcrumbPaths[page] || [{ link: '/', label: 'Home' }];
