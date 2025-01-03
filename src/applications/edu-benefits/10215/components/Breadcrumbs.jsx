import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const BreadCrumbs = () => {
  const isCalculationInstructionPath = () => {
    const url = new URL(window.location);
    const { pathname } = url;
    return (
      pathname ===
      '/education/apply-for-education-benefits/application/10215/85/15-calculations'
    );
  };
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
        '/education/apply-for-education-benefits/application/10215/introduction',
      label: 'Report 85/15 Rule enrollment ratios',
    },
  ];
  if (isCalculationInstructionPath()) {
    crumbs.push({
      href: '/',
      label: 'Calculation instructions',
    });
  }
  return (
    <div className="row">
      <VaBreadcrumbs uswds breadcrumbList={crumbs} />
    </div>
  );
};

export default BreadCrumbs;
