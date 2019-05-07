import React from 'react';

import RoutedSavableApp from '../../../platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from './config/form';

export default function Form1995TechEntry({ location, children }) {
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}
