import React from 'react';

import RoutedSavableApp from '../../common/schemaform/save-in-progress/RoutedSavableApp';

import PrestartWrapper from './components/PrestartWrapper';
import formConfig from './config/form';

export default function Form526Entry({ location, children }) {

  return (
    <PrestartWrapper>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </PrestartWrapper>
  );
}
