import React from 'react';
import { useLocation, useHistory, useParams } from 'react-router-dom';

import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

const uuidRegex = /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[89ABCD][0-9A-F]{3}-[0-9A-F]{12}/;

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const history = useHistory();
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const smocEnabled = useToggleValue(
    TOGGLE_NAMES.travelPaySubmitMileageExpense,
  );

  const isDetailsPage = new RegExp(
    /\/claims\//.source + uuidRegex.source,
    'i',
  ).test(pathname);
  const isStatusExplainer = pathname.includes('/help');

  const { id: claimId } = useParams();

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
      label: smocEnabled
        ? 'Travel reimbursement claims'
        : 'Check your travel reimbursement claim status',
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

  return (
    <VaBreadcrumbs
      breadcrumbList={breadcrumbList}
      className="vads-u-padding-0"
      label="Breadcrumb"
      uswds
      onRouteChange={handleRouteChange}
    />
  );
}
