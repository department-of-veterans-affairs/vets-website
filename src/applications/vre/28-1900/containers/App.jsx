import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
// import Breadcrumbs from '../components/Breadcrumbs';

export default function App({ location, children }) {
  return (
    <>
      {/* <Breadcrumbs /> */}

      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}
