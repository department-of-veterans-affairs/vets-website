/**
 * Function takes a page name and returns an array of breadcrumbs for that page
 *
 * @param {string} page
 * @returns {Array}
 */
export const POABreadcrumbs = page => {
  let breadcrumbs = [];

  switch (page) {
    case 'dashboard':
      breadcrumbs = [
        { link: '/', label: 'Home' },
        { link: '/dashboard', label: 'Dashboard' },
      ];
      break;
    case 'permissions':
      breadcrumbs = [
        { link: '/', label: 'Home' },
        { link: '/permissions', label: 'Permissions' },
      ];
      break;
    case 'poa-requests':
      breadcrumbs = [
        { link: '/', label: 'Home' },
        { link: '/poa-requests', label: 'POA requests' },
      ];
      break;
    default:
      breadcrumbs = [{ link: '/', label: 'Home' }];
      break;
  }

  return breadcrumbs;
};
