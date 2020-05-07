import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from './config/form';

import ITFWrapper from '../all-claims/containers/ITFWrapper';
import RequiredServicesGate from '../all-claims/containers/RequiredServicesGate';

export default function BDDEntry({ location, children }) {
  // wraps the app and redirects user if they are not enrolled
  return (
    <RequiredServicesGate location={location}>
      <ITFWrapper location={location}>
        <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
          {children}
        </RoutedSavableApp>
      </ITFWrapper>
    </RequiredServicesGate>
  );
}
