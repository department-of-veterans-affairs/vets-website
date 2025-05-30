import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import NoFormPage from '../components/NoFormPage';

export default function App({ location, children, isLoading }) {
  const featureToggle = useSelector(
    state => state?.featureToggles?.vaDependentsVerification,
  );

  if (isLoading) {
    return <va-loading-indicator message="Loading your information..." />;
  }

  return featureToggle ? (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  ) : (
    <NoFormPage />
  );
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
  isLoading: PropTypes.bool,
};
