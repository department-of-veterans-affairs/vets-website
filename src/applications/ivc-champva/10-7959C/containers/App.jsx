import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import formConfig from '../config/form';

const breadcrumbList = [
  { href: '/', label: 'VA.gov home' },
  {
    href: `/family-and-caregiver-benefits`,
    label: `Family and Caregiver Benefits`,
  },
  {
    href: `/family-and-caregiver-benefits/health-and-disability/`,
    label: `Health and Disability`,
  },
  {
    href: `/family-and-caregiver-benefits/health-and-disability/champva`,
    label: `CHAMPVA benefits`,
  },
];

export default function App({ location, children }) {
  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <VaBreadcrumbs breadcrumbList={breadcrumbList} />
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </div>
  );
}
