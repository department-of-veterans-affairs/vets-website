import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation, useHistory, useParams } from 'react-router-dom';

export default function BreadCrumbs() {
  const { pathname } = useLocation();
  const history = useHistory();
  const uuidPathRegex = /^\/claims\/[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[89ABCD][0-9A-F]{3}-[0-9A-F]{12}$/i;
  const isDetailsPage = pathname.match(uuidPathRegex);
  const isStatusExplainer = pathname.includes('/help');

  const { apptId } = useParams();

  // TODO: this needs work
  const isSubmitWrapper = pathname.includes(`/file-new-claim/${apptId}`);
  const isFileClaimExplainerPage = pathname.includes('/file-new-claim');

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

  if (isFileClaimExplainerPage) {
    breadcrumbList.push({
      href: '/file-new-claim',
      label: 'How to file a travel reimbursement claim',
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
    <>
      {isDetailsPage && (
        <div className="vads-u-padding-top--2p5 vads-u-padding-bottom--4">
          <va-link
            id="details-back-link"
            back
            href="/my-health/travel-pay/claims/"
            text="Back to your travel reimbursement claims"
          />
        </div>
      )}
      {isSubmitWrapper && (
        <div className="vads-u-padding-top--2p5 vads-u-padding-bottom--4">
          <va-link
            id="submit-back-link"
            back
            href={`/my-health/appointments/past/${apptId}`}
            text="Back to your appointment"
          />
        </div>
      )}
    </>
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
