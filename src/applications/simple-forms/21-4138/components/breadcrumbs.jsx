import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';

export const Breadcrumbs = (
  <VaBreadcrumbs
    className="breadcrumbs-container"
    breadcrumbList={[
      {
        href: '/',
        label: 'Home',
      },
      {
        href: '/supporting-forms-for-claims',
        label: 'Supporting forms for VA claims',
      },
      {
        href:
          '/supporting-forms-for-claims/statement-to-support-claim-form-21-4138',
        label: 'Submit a statement to support a claim',
      },
    ]}
    label="Breadcrumb"
    homeVeteransAffairs={false}
  />
);

export const CustomTopContent = ({ currentLocation }) => {
  if (
    currentLocation?.pathname.includes('confirmation') ||
    currentLocation?.pathname.includes('introduction')
  ) {
    return <>{Breadcrumbs}</>;
  }
  return null;
};
