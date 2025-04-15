import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation, useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom-v5-compat';

const uuidRegex = /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[89ABCD][0-9A-F]{3}-[0-9A-F]{12}/;

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const history = useHistory();

  const isDetailsPage = new RegExp(
    /\/claims\//.source + uuidRegex.source,
    'i',
  ).test(pathname);
  const isStatusExplainer = pathname.includes('/help');

  const { apptId, id: claimId } = useParams();

  const isSubmitWrapper = new RegExp(
    /\/file-new-claim\//.source + apptId,
    'i',
  ).test(pathname);

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

  if (isDetailsPage) {
    breadcrumbList.push({
      href: `/claims/${claimId}`,
      label: 'Your travel reimbursement claim',
      isRouterLink: true,
    });
  }

  const handleRouteChange = ({ detail }) => {
    const { href } = detail;
    history.push(href);
  };

  return isSubmitWrapper ? (
    <div className="vads-u-padding-top--2p5 vads-u-padding-bottom--4">
      <va-link
        data-testid="submit-back-link"
        back
        href={`/my-health/appointments/past/${apptId}`}
        text="Back to your appointment"
      />
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
