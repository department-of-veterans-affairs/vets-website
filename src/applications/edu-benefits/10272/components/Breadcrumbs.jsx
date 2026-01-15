import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

const Breadcrumbs = () => {
  const crumbs = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/forms',
      label: 'VA forms',
    },
    {
      href: '/forms/22-10272',
      label:
        'Licensing or certification test prep course reimbursement (VA Form 22-10272)',
    },
    {
      href: 'forms/22-10272/request-prep-course-reimbursement-online',
      label:
        'Request licensing or certification test prep course fees reimbursement online',
    },
  ];
  return (
    <div className="row">
      <div className="vads-u-margin-left--2 mobile-lg:vads-u-margin-left--1">
        <VaBreadcrumbs
          breadcrumbList={crumbs}
          data-testid="breadcrumbs"
          wrapping
        />
      </div>
    </div>
  );
};

export default Breadcrumbs;
