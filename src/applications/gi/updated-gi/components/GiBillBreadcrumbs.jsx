import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { giDocumentTitleSchoolsAndEmployers } from '../../utils/helpers';

const GiBillBreadcrumbs = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const crumbLiEnding = giDocumentTitleSchoolsAndEmployers();
  const isSchools = pathname.includes('schools-and-employers');

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
      href: '/',
      label: 'GI Bill® Comparison Tool',
      isRouterLink: true,
    },
  ];

  if (isSchools)
    crumbs.push({
      href: '/schools-and-employers',
      label: crumbLiEnding,
      isRouterLink: true,
    });

  const handleRouteChange = ({ detail }) => {
    const { href } = detail;
    history.push(href);
  };

  return (
    <div className="gi-bill-container__bread-crumbs">
      <VaBreadcrumbs
        uswds
        breadcrumbList={crumbs}
        onRouteChange={handleRouteChange}
      />
    </div>
  );
};

export default GiBillBreadcrumbs;
