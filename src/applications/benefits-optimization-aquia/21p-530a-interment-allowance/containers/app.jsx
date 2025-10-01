/**
 * @module containers/App
 * @description Main application container component for VA Form 21P-530A
 */

import React from 'react';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '@bio-aquia/21p-530a-interment-allowance/config/form';

/**
 * Root application component that wraps the form with save-in-progress functionality
 * @param {Object} props - Component properties
 * @param {Object} props.location - React Router location object
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {React.ReactElement} Routed savable application wrapper
 */
export default function App({ location, children }) {
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
