import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import NoFormPage from '../components/NoFormPage';
import manifest from '../manifest.json';

export default function App({ location, children }) {
  const featureToggle = useSelector(
    state => state?.featureToggles?.vaDependentsVerification,
  );
  const { loading } = useSelector(state => state?.externalServiceStatuses);
  const hasSession = () => JSON.parse(localStorage.getItem('hasSession'));

  const content = (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );

  // Handle loading
  if (loading) {
    return <va-loading-indicator message="Loading your information..." />;
  }

  // If on intro page, just return content
  if (location?.pathname === '/introduction') {
    return content;
  }

  if (!hasSession() && !location?.pathname?.includes('/introduction')) {
    window.location.replace(`${manifest.rootUrl}/introduction`);
    return <va-loading-indicator message="Loading your information..." />;
  }

  return featureToggle ? content : <NoFormPage />;
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
