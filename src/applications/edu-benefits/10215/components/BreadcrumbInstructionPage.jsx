import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const BreadcrumbInstructionPage = () => {
  const crumbs = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/school-administrators/',
      label: 'Resources for schools',
    },
    {
      href:
        '/education/apply-for-education-benefits/application/10215/introduction/',
      label: 'Report 85/15 Rule enrollment ratios',
    },
    {
      href:
        '/education/apply-for-education-benefits/application/10215/calculation-instructions',
      label: 'Calculation instructions',
    },
  ];
  return (
    <div className="row">
      <VaBreadcrumbs uswds breadcrumbList={crumbs} />
    </div>
  );
};

export default BreadcrumbInstructionPage;
