import React from 'react';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '@bio-aquia/21-2680-house-bound-status/config/form';

/**
 * Main application container component for VA Form 21-2680
 * @module containers/app
 */
export const App = ({ location, children }) => (
  <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
    {children}
  </RoutedSavableApp>
);

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
  router: PropTypes.object,
};
