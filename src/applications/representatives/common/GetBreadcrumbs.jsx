import React from 'react';
import { Link } from 'react-router';

export const GetBreadcrumbs = ({ page }) => {
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
    '': [{ link: '/', label: 'Home' }], // default to home if page is not found
  };

  return (
    <>
      {breadcrumbPaths[page].map(({ link, label }) => (
        <li key={link}>
          <Link to={link}>{label}</Link>
        </li>
      ))}
    </>
  );
};
