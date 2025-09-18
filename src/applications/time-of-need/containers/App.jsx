import React from 'react';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { wrapWithBreadcrumb } from '../components/Breadcrumbs';

export default function App({ location, children }) {
  const { pathname } = location || {};
  return wrapWithBreadcrumb(
    <article id="form-40-xxxx" data-location={`${pathname?.slice(1)}`}>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </article>,
    location,
  );
}
