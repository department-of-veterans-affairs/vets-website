import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { giDocumentTitle } from '../utils/helpers';

const GiBillBreadcrumbs = () => {
  const profileMatch = useRouteMatch('/institution/:facilityCode');
  const compareMatch = useRouteMatch('/compare');
  const crumbLiEnding = giDocumentTitle();

  const crumbs = [
    { href: '/', label: 'Home' },
    { href: '/education', label: 'Education and training' },
    { href: '/', label: crumbLiEnding, isRouterLink: true },
  ];

  if (profileMatch) {
    crumbs.push({
      href: `/institution/${profileMatch.params.facilityCode}`,
      label: 'Institution details',
      isRouterLink: true,
    });
  }

  if (compareMatch) {
    crumbs.push({
      href: '/',
      label: 'Institution comparison',
      isRouterLink: true,
    });
  }
  const bcString = JSON.stringify(crumbs);

  return <va-breadcrumbs breadcrumb-list={bcString} />;
};

export default GiBillBreadcrumbs;
