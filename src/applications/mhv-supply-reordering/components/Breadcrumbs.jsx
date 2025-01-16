import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import manifest from '../manifest.json';

const breadcrumbList = [
  {
    href: '/',
    label: 'VA.gov Home',
  },
  {
    href: '/my-health',
    label: 'Health care',
  },
  {
    href: manifest.rootUrl,
    label: manifest.appName,
  },
];

const Breadcrumbs = () => <VaBreadcrumbs breadcrumbList={breadcrumbList} />;

export default Breadcrumbs;
