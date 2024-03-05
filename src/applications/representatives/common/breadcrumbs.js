import React from 'react';
import { Link } from 'react-router';

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

export const POABreadcrumbs = () => {
  const page = document.location.pathname.split('/').pop();
  const pageBreadcrumbs = breadcrumbPaths[page] || [
    { link: '/', label: 'Home' },
  ];

  return (
    <>
      {pageBreadcrumbs.map(({ link, label }) => (
        <li key={link}>
          <Link to={link}>{label}</Link>
        </li>
      ))}
    </>
  );
};
