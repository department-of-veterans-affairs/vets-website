import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const BreadcrumbAboutPage = () => {
  const crumbs = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/find-forms/',
      label: 'Find VA Form',
    },
    {
      href: '/education/apply-for-education-benefits/application/10216/',
      label: 'About VA Form 22-10216',
    },
  ];
  return (
    <div className="row">
      <VaBreadcrumbs uswds breadcrumbList={crumbs} />
    </div>
  );
};

export default BreadcrumbAboutPage;
