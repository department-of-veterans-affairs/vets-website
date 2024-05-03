import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <>
      <va-breadcrumbs uswds="false">
        <a href="/">Home</a>
        <a href="/health-care">Health care</a>
        <a href="/health-care/foreign-medical-program">
          Foreign Medical Program (FMP)
        </a>
        <a href="/health-care/foreign-medical-program/">
          Register for the Foreign Medical Program (FMP)
        </a>
      </va-breadcrumbs>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}
