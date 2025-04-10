import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const BreadcrumbUsedInForm = () => {
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
      href: '/school-administrators/35-percent-exemption/introduction',
      label: 'Request exemption from the 85/15 Rule reporting requirement',
    },
  ];
  return (
    <div className="row">
      <div className="vads-u-margin-left--2 mobile-lg:vads-u-margin-left--1">
        <VaBreadcrumbs uswds breadcrumbList={crumbs} />
      </div>
    </div>
  );
};

export default BreadcrumbUsedInForm;
