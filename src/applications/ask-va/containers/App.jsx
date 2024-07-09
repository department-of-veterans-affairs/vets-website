import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import React from 'react';
import BreadCrumbs from '../components/BreadCrumbs';
import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <>
      <div className="row">
        <div className="usa-width-two-thirds medium-8 columns">
          <BreadCrumbs currentLocation={location.pathname} />
        </div>
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}
