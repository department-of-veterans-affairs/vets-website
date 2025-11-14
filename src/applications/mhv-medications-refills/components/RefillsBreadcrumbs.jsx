import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

/**
 * Breadcrumbs component for medications refills page
 * Shows full navigation path
 */
const RefillsBreadcrumbs = () => {
  const breadcrumbLabels = [
    { href: '/', label: 'VA.gov home' },
    { href: '/my-health', label: 'My Health' },
    { href: '/my-health/medications', label: 'Medications' },
    { href: '/my-health/medications/refill', label: 'Refill medications' },
  ];

  return (
    <VaBreadcrumbs
      uswds
      wrapping
      label="Breadcrumb"
      breadcrumbList={breadcrumbLabels}
      className="no-print va-breadcrumbs-li vads-u-margin-bottom--neg1p5 vads-u-display--block"
    />
  );
};

export default RefillsBreadcrumbs;
