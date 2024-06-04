import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function BreadCrumbs() {
  return (
    <VaBreadcrumbs
      breadcrumbList={[
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
        },
      ]}
      label="Breadcrumb"
      uswds
      wrapping
    />
  );
}
