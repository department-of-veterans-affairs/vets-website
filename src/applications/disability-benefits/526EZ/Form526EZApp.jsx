import React from 'react';

import RoutedSavableApp from '../../../platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from './config/form';

import ITFWrapper from './containers/ITFWrapper';
import DisabilityGate from './containers/DisabilityGate';

export default function Form526Entry({ location, children }) {
  return (
    <ITFWrapper location={location}>
      <DisabilityGate>
        <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
          {children}
        </RoutedSavableApp>
      </DisabilityGate>
    </ITFWrapper>
  );
}
