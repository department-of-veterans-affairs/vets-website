import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import CustomFormApp from '../components/CustomFormApp';

export default function App({ location, children }) {
  return (
    <RoutedSavableApp
      formConfig={formConfig}
      currentLocation={location}
      FormApp={CustomFormApp}
    >
      {children}
    </RoutedSavableApp>
  );
}
