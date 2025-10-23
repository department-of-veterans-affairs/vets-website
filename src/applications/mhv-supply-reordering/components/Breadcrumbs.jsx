import React from 'react';
import manifest from '../manifest.json';

const breadcrumbList = [
  {
    href: '/',
    label: 'VA.gov Home',
  },
  {
    href: '/my-health',
    label: 'My HealtheVet',
  },
  {
    href: manifest.rootUrl,
    label: manifest.appName,
  },
];
const bcString = JSON.stringify(breadcrumbList);

const Breadcrumbs = () => (
  <va-breadcrumbs
    className="breadcrumbs-container"
    breadcrumb-list={bcString}
    label="Breadcrumb"
    home-veterans-affairs={false}
    data-testid="breadcrumbs"
  />
);

export default Breadcrumbs;
