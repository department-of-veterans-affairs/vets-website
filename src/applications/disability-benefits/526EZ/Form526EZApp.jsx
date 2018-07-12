import React from 'react';

import RoutedSavableApp from '../../../platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from './config/form';

import ITFWrapper from './containers/ITFWrapper';

export default function Form526Entry({ location, children }) {
  return (
    <ITFWrapper location={location}>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </ITFWrapper>
  );
}
