import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation, useHistory } from 'react-router-dom';

export default function BreadCrumbs() {
  const { pathname } = useLocation();
  const history = useHistory();

  const isStatusText = pathname.includes('what-does-my-status-mean');

  const breadcrumbList = [
    {
      href: '/',
      // the `home-veterans-affairs` prop defaults to this
      // label, but including it here to be explicit.
      label: 'VA.gov home',
    },
    {
      href: '/my-health',
      label: 'My HealtheVet',
    },
    {
      href: '/',
      label: 'Check your travel reimbursement claim status',
      isRouterLink: true,
    },
  ];

  if (isStatusText) {
    breadcrumbList.push({
      href: '/what-does-my-status-mean',
      label: 'Claim Status Meanings',
      isRouterLink: true,
    });
  }

  if (
    pathname.match(
      /^\/[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i,
    )
  ) {
    breadcrumbList.push({
      href: '/claim-details',
      label: 'Claim Details',
      isRouterLink: true,
    });
    // breadcrumbList = [
    //   {
    //     href: '/',
    //     label: 'Back to your travel reimbursement claims',
    //     isRouterLink: true,
    //   },
    // ];
  }

  function handleRouteChange({ detail }) {
    const { href } = detail;
    history.push(href);
  }

  return (
    <VaBreadcrumbs
      // homeVeteransAffairs={false}
      breadcrumbList={breadcrumbList}
      label="Breadcrumb"
      uswds
      wrapping
      onRouteChange={handleRouteChange}
    />
  );
}
