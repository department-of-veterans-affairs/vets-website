import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <>
      <Breadcrumbs>
        <a href="/">Home</a>
        <a href="/health-care">Health care</a>
        <a href="/health-care/covid-19-vaccine">COVID-19 vaccines at VA</a>
        <a href="/health-care/covid-19-vaccine/stay-informed">
          Sign up to get a vaccine
        </a>
      </Breadcrumbs>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}
