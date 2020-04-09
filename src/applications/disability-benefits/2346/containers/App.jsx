import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <>
      <Breadcrumbs>
        {[
          <a href="#" key="1">
            Home
          </a>,
          <a href="#" key="2">
            Health care
          </a>,
          <a href="#" key="3">
            Order hearing aid batteries and accessories
          </a>,
        ]}
      </Breadcrumbs>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}
