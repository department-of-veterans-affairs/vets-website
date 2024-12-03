import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation, useHistory, Link } from 'react-router-dom';

export default function BreadCrumbs() {
  const { pathname } = useLocation();
  const history = useHistory();
  const uuidPathRegex = /^\/claims\/[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[89ABCD][0-9A-F]{3}-[0-9A-F]{12}$/i;
  const isDetailsPage = pathname.match(uuidPathRegex);
  const isStatusExplainer = pathname.includes('what-does-my-claim-status-mean');

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

  if (isStatusExplainer) {
    breadcrumbList.push({
      href: '/what-does-my-claim-status-mean',
      label: 'Claim Status Meanings',
      isRouterLink: true,
    });
  }

  const handleRouteChange = ({ detail }) => {
    const { href } = detail;
    history.push(href);
  };

  return isDetailsPage ? (
    <div className="travel-pay-breadcrumb-wrapper">
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
