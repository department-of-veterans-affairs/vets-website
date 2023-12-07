import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import formConfig from '../config/form';

export default function App({ location, children }) {
  const breadcrumbList = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/application-for-champva-benefits',
      label: 'Apply for CHAMPVA',
    },
  ];
  return (
    <>
      <div className="row">
        <VaBreadcrumbs breadcrumbList={breadcrumbList} uswds />
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}
