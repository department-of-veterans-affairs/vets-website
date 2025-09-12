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
      href: '/education',
      label: 'Education and training',
    },
    {
      href: '/education/other-va-education-benefits',
      label: 'Other VA education benefits',
    },
    {
      href: 'education/other-va-education-benefits/vet-tec-2',
      label: 'VET TEC 2.0 (high-tech program)',
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
