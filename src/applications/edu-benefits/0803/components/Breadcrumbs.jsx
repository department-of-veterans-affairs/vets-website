import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import manifest from '../manifest.json';
import { TITLE } from '../constants';

const Breadcrumbs = () => {
  const crumbs = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/forms',
      label: 'VA Forms',
    },
    {
      href: '/forms/22-0803',
      label:
        'Licensing or certification test fee reimbursement (VA Form 22-0803)',
    },
    {
      href: manifest.rootUrl,
      label: TITLE,
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
