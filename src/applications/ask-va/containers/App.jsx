import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import React from 'react';
import formConfig from '../config/form';
import BreadCrumbs from '../components/BreadCrumbs';
import ProgressBar from '../components/ProgressBar';

export default function App({ location, children }) {
  return (
    <>
      <BreadCrumbs currentLocation={location.pathname} />
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        <ProgressBar pathname={location.pathname} />
        {children}
      </RoutedSavableApp>
    </>
  );
}
