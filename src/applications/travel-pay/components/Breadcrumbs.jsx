import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation, useHistory, Link } from 'react-router-dom';

export default function BreadCrumbs() {
  const { pathname } = useLocation();
  const history = useHistory();
  // the claim id is made opaque/obfuscated and represented in a hexdigest of 64 characters
  const claimIdPathRegex = /^\/[\da-f]{64}$/i;
  const isDetailsPage = pathname.match(claimIdPathRegex);

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
      href: '/my-health/travel-claim-status',
      label: 'Check your travel reimbursement claim status',
      isRouterLink: true,
    },
  ];

  const handleRouteChange = ({ detail }) => {
    const { href } = detail;
    history.push(href);
  };

  return isDetailsPage ? (
    <div className="claim-details-breadcrumb-wrapper">
      {isDetailsPage && <va-icon class="back-arrow" icon="arrow_back" />}
      <Link className="go-back-link" to="/">
        Back to your travel reimbursement claims
      </Link>
    </div>
  ) : (
    <VaBreadcrumbs
      breadcrumbList={breadcrumbList}
      className="vads-u-padding-0"
      label="Breadcrumb"
      uswds
      onRouteChange={handleRouteChange}
    />
  );
}
