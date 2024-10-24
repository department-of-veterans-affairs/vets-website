import React from 'react';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import ErrorBoundary from '../components/ErrorBoundary';

const App = ({ children, location }) => (
  <ErrorBoundary>
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  </ErrorBoundary>
);

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};

export default App;
