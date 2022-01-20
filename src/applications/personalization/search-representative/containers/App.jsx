import React from 'react';

import FormFooter from 'platform/forms/components/FormFooter';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import formConfig from '../config/form';

export default function App({ children, location }) {
  return (
    <>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <FormFooter formConfig={formConfig} />
    </>
  );
}
