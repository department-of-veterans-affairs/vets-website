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
      href: '/education/about-gi-bill-benefits/',
      label: 'About GI bill benefits',
    },
    {
      href: '/education/about-gi-bill-benefits/how-to-use-benefits/',
      label: 'How to use your GI bill benefits',
    },
    {
      href: '/education/about-gi-bill-benefits/how-to-use-benefits/licensing-and-certification-tests/',
      label: 'Licensing and certification test prep courses',
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
