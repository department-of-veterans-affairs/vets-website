import React from 'react';

import RoutedSavableSinglePageFormApp from './RoutedSavableSinglePageFormApp';
import formConfig from '../config/form';

export default function Form0993App({ location, children }) {
  return (
    <RoutedSavableSinglePageFormApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableSinglePageFormApp>
  );
}
