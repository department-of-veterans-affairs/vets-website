import React from 'react';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';

export default function TOEApp({ location, children }) {
  return (
    <>
      <va-breadcrumbs>
        <a href="/">Home</a>
        <a href="/education/">Education and training</a>
        <a href="/transfer-education-benefits/">Apply for education benefits</a>
      </va-breadcrumbs>

      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
}

TOEApp.propTypes = {
  children: PropTypes.array,
  location: PropTypes.any,
};
