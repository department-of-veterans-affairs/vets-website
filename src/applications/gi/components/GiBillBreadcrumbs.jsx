import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useRouteMatch } from 'react-router-dom';
import { giDocumentTitle } from '../utils/helpers';

const GiBillBreadcrumbs = () => {
  const profileMatch = useRouteMatch('/institution/:facilityCode');
  const compareMatch = useRouteMatch('/compare');
  const crumbLiEnding = giDocumentTitle();
  const crumbs = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/education',
      label: 'Education and training',
    },
    {
      href: '/education/gi-bill-comparison-tool/',
      label: crumbLiEnding,
    },
  ];
  if (profileMatch) {
    crumbs.push({
      href: `/institution/${profileMatch.params.facilityCode}`,
      label: 'Institution details',
    });
  }
  if (compareMatch) {
    crumbs.push({
      href: '/',
      label: 'Institution comparison',
    });
  }

  return (
    <div className="row">
      <VaBreadcrumbs uswds breadcrumbList={crumbs} />
    </div>
  );
};

export default GiBillBreadcrumbs;
