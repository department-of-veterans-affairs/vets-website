import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import manifest from '../manifest.json';

const Breadcrumbs = () => {
  const crumbs = [
    {
      href: '/',
      label: 'Va.gov home',
    },
    {
      href: '/education',
      label: 'Resources for schools',
    },
    {
      href: manifest.rootUrl,
      label: 'Apply for the approval of a program in a foreign country',
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
