import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import environment from 'platform/utilities/environment';

export default function App({ location, children }) {
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {// Prod Flag bah-23496
      location.pathname === '/apply' &&
        !environment.isProduction() && (
          <AlertBox
            status="info"
            content="This is the personal information we have on file for you."
          />
        )}
      {children}
    </RoutedSavableApp>
  );
}
