import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <>
      <div className="large-screen:vads-u-padding-left--0 vads-u-padding-left--1">
        <VaBreadcrumbs label="Breadcrumb">
          <a href="/">Home</a>
          <a href="/health-care">Health care</a>
          <a href="/health-care/covid-19-vaccine">COVID-19 vaccines at VA</a>
          <a href="/health-care/covid-19-vaccine/stay-informed">
            Sign up to get a vaccine
          </a>
        </VaBreadcrumbs>
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}
