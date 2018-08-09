import React from 'react';

import RoutedSavableApp from '../../../platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from './config/form';

import ITFWrapper from './containers/ITFWrapper';
import EVSSClaimsGate from './containers/EVSSClaimsGate';

export default function Form526Entry({ location, children }) {
  return (
    <EVSSClaimsGate location={location}>
      <ITFWrapper location={location}>
        <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
          {children}
        </RoutedSavableApp>
      </ITFWrapper>
    </EVSSClaimsGate>
  );
}
