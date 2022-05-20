import React from 'react';
import { useLocation } from 'react-router-dom';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from './form/form';

export default function App({ children }) {
  const location = useLocation();
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}
