import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const Breadcrumbs = () => {
  const crumbs = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/education',
      label: 'Education and training',
    },
    {
      href: '/education/other-va-education-benefits',
      label: 'Other VA education benefits',
    },
    {
      href: 'education/other-va-education-benefits/high-technology-program/',
      label: 'High Technology Program',
    },
    {
      href:
        '/education/other-va-education-benefits/high-technology-program/apply-for-high-technology-program-form-22-10297/introduction/',
      label: 'Apply for the High Technology Program',
    },
  ];
  return (
    <div className="row">
      <div className="vads-u-margin-left--2 mobile-lg:vads-u-margin-left--1">
        <VaBreadcrumbs
          uswds
          breadcrumbList={crumbs}
          data-testid="breadcrumbs"
        />
      </div>
    </div>
  );
};

export default Breadcrumbs;
