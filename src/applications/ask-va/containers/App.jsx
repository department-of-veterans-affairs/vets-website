import React from 'react';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import NeedHelpFooter from '../components/NeedHelpFooter';
import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
      <NeedHelpFooter />
    </RoutedSavableApp>
  );
}
