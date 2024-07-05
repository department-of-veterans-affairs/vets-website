import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <>
      <va-breadcrumbs uswds="false" class="va-nav-breadcrumbs">
        <a href="/">VA.gov Home</a>
        <a href="/benefit-eligibility-questionnaire">
          Benefit eligibility questionnaire
        </a>
      </va-breadcrumbs>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}
