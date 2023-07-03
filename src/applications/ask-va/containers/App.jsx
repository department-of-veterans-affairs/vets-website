import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfigFn from '../config/form';

export default function App({ location, children }) {
  return (
    <RoutedSavableApp formConfig={formConfigFn()} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}
