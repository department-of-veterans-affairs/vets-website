import React from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

export default function App({ location, children }) {
  return (
    <>
      <va-breadcrumbs uswds="false">
        <a href="/">Home</a>
        <a href="/health-care">Health care</a>
        <a href="/health-care/foreign-medical-program">
          Foreign Medical Program
        </a>
        <a href="/health-care/foreign-medical-program">File a claim</a>
      </va-breadcrumbs>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}

App.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};
