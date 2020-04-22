import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <>
      <Breadcrumbs>
        <a href="/">Home</a>
        {/* this will get updated when this route is added */}
        <a href="/health-care">Health care</a>
        <span className="vads-u-color--black">
          Order hearing aid batteries and accessories
        </span>
      </Breadcrumbs>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}
