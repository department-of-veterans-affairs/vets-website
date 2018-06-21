import React from 'react';

import RoutedSavableApp from '../../../platform/forms/save-in-progress/RoutedSavableApp';

import PrestartWrapper from './components/PrestartWrapper';
import formConfig from './config/form';

export default function Form526Entry({ location, children }) {

  return (
    <PrestartWrapper formConfig={formConfig}>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </PrestartWrapper>
  );
}
