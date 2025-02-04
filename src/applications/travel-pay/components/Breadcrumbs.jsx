import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation, useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom-v5-compat';

export default function BreadCrumbs() {
  const { pathname } = useLocation();
  const history = useHistory();
  const uuidPathRegex = /^\/claims\/[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[89ABCD][0-9A-F]{3}-[0-9A-F]{12}$/i;
  const isDetailsPage = pathname.match(uuidPathRegex);
  const isStatusExplainer = pathname.includes('/help');

  const { apptId } = useParams();

  // TODO: this might need work - it works for now, but we might need a regex like the isDetailsPage
  const isSubmitWrapper = pathname.includes(`/file-new-claim/${apptId}`);

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
      href: '/claims/',
      label: 'Check your travel reimbursement claim status',
      isRouterLink: true,
    },
  ];

  if (isStatusExplainer) {
    breadcrumbList.push({
      href: '/help',
      label: 'Help: Claim Status Meanings',
      isRouterLink: true,
    });
  }

  if (isSubmitWrapper) {
    breadcrumbList.push({
      href: `/file-new-claim/${apptId}`,
      label: 'File a new travel claim',
      isRouterLink: true,
    });
  }

  const handleRouteChange = ({ detail }) => {
    const { href } = detail;
    history.push(href);
  };

  return isDetailsPage || isSubmitWrapper ? (
    <div className="vads-u-padding-top--2p5 vads-u-padding-bottom--4">
      {isDetailsPage && (
        <va-link
          data-testid="details-back-link"
          back
          href="/my-health/travel-pay/claims/"
          text="Back to your travel reimbursement claims"
        />
      )}
      {isSubmitWrapper && (
        <va-link
          data-testid="submit-back-link"
          back
          href={`/my-health/appointments/past/${apptId}`}
          text="Back to your appointment"
        />
      )}
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
