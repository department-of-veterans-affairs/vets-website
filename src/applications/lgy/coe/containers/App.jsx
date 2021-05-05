import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <>
      <Breadcrumbs>
        <a href="/">Home</a>
        {/* this will get updated when this route is added */}
        <a href="/housing-assistance/">Housing assistance</a>
        <a href="/housing-assistance/home-loans/">VA-backed home loans</a>
        <a href="/housing-assistance/home-loans/apply-lgy-form-1880/">
          Apply for Certificate of Eligibility Form 26-1880
        </a>
      </Breadcrumbs>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}
