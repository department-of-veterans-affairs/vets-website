import React from 'react';
import { useLocation } from 'react-router-dom';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from './form/form';

const routeObjects = createRoutesWithSaveInProgress(formConfig);

export default function App({ children }) {
  const location = useLocation();
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
      {routeObjects}
    </RoutedSavableApp>
  );
}
