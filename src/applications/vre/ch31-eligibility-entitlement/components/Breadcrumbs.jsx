import React from 'react';
import { useLocation } from 'react-router-dom-v5-compat';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const baseUrl = '/careers-employment';
  const eligibilityPath = '/careers-employment/your-vre-eligibility';
  let normalizedPath = pathname;

  if (pathname === '/') {
    normalizedPath = eligibilityPath;
  } else if (!pathname.startsWith(baseUrl)) {
    normalizedPath = `${baseUrl}${pathname}`;
  }

  const baseCrumbs = [
    { href: '/', label: 'VA.gov home' },
    { href: '/careers-employment', label: 'Careers and employment' },
  ];

  const routeCrumbs = normalizedPath.startsWith(eligibilityPath)
    ? [
        {
          href: eligibilityPath,
          label: 'Your VR&E eligibility and benefits',
        },
      ]
    : [];

  const crumbs = [...baseCrumbs, ...routeCrumbs];

  return (
    <div className="row">
      <div className="usa-width-two-thirds desktop-lg:vads-u-padding-left--0 vads-u-padding-left--2">
        <VaBreadcrumbs
          uswds
          wrapping
          breadcrumbList={crumbs}
          data-testid="breadcrumbs"
        />
      </div>
    </div>
  );
};

export default Breadcrumbs;
