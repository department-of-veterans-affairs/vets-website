import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {location.pathname === '/apply' && (
        <AlertBox
          status="info"
          content="This is the personal information we have on file for you."
        />
      )}
      {children}
    </RoutedSavableApp>
  );
}
