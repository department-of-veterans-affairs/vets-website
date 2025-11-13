import { medicationsUrls } from '../constants';

/**
 * Creates the breadcrumb state based on the current location path.
 * This function returns an array of breadcrumb objects for rendering in UI component.
 * It should be called whenever the route changes if breadcrumb updates are needed.
 *
 * @param {Object} location - The location object from React Router, containing the current pathname.
 * @param {Number} currentPage - The current page number.
 * @returns {Array<Object>} An array of breadcrumb objects with `url` and `label` properties.
 */
export const createBreadcrumbs = (location, currentPage) => {
  const { pathname } = location;
  const defaultBreadcrumbs = [
    {
      href: medicationsUrls.VA_HOME,
      label: 'VA.gov home',
    },
    {
      href: medicationsUrls.MHV_HOME,
      label: 'My HealtheVet',
    },
  ];
  const {
    subdirectories,
    MEDICATIONS_URL,
    MEDICATIONS_REFILL,
  } = medicationsUrls;

  if (pathname === subdirectories.BASE) {
    return defaultBreadcrumbs.concat([
      {
        href: `${MEDICATIONS_URL}?page=${currentPage || 1}`,
        label: 'Medications',
      },
    ]);
  }
  if (pathname.includes(subdirectories.REFILL)) {
    return defaultBreadcrumbs.concat([
      { href: MEDICATIONS_URL, label: 'Medications' },
      { href: MEDICATIONS_REFILL, label: 'Refill prescriptions' },
    ]);
  }
  return [];
};
