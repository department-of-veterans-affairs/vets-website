import React from 'react';
import { useLocation } from 'react-router-dom-v5-compat';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const baseUrl =
    '/careers-employment/track-your-vre-benefits/vre-benefit-status';
  const normalizedPath = pathname.startsWith(baseUrl)
    ? pathname
    : `${baseUrl}${pathname}`;

  const baseCrumbs = [
    { href: '/', label: 'VA.gov home' },
    { href: '/careers-employment', label: 'Careers and employment' },
  ];

  const routes = [
    {
      match:
        '/careers-employment/track-your-vre-benefits/vre-benefit-status/career-planning',
      crumbs: [
        {
          href: '/careers-employment/track-your-vre-benefits',
          label: 'Track your VR&E benefits',
        },
        {
          href:
            '/careers-employment/track-your-vre-benefits/vre-benefit-status',
          label: 'Your VR&E benefit status',
        },
        {
          href:
            '/careers-employment/track-your-vre-benefits/vre-benefit-status/career-planning',
          label: 'Career Planning',
        },
      ],
    },
    {
      match: '/careers-employment/track-your-vre-benefits/vre-benefit-status',
      crumbs: [
        {
          href: '/careers-employment/track-your-vre-benefits',
          label: 'Track your VR&E benefits',
        },
        {
          href:
            '/careers-employment/track-your-vre-benefits/vre-benefit-status',
          label: 'Your VR&E benefit status',
        },
      ],
    },
  ];

  const routeCrumbs =
    routes.find(route => normalizedPath.startsWith(route.match))?.crumbs || [];

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
