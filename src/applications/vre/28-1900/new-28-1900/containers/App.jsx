import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

// previously was exported as default
export function App({ location, children }) {

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}
