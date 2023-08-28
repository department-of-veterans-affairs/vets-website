import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage';

export default function PensionsApp({ location, children }) {
  const showForm = false;
  return showForm ? (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  ) : (
    <NoFormPage />
  );
}
