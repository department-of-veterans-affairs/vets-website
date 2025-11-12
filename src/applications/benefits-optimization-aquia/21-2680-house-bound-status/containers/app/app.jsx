/**
 * @module containers/app
 * @description Main application container for VA Form 21-2680
 */

import PropTypes from 'prop-types';
import React from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config';

/**
 * Root application component for VA Form 21-2680
 *
 * Wraps the form with RoutedSavableApp to provide save-in-progress functionality,
 * auto-save on navigation, form state management, and session timeout handling.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child route components (form pages)
 * @param {Object} props.location - React Router location object
 */
export const App = ({ location, children }) => (
  <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
    {children}
  </RoutedSavableApp>
);

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};

export default App;
