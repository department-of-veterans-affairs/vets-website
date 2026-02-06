import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog/';

import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage';

/**
 * Burials Application
 * @typedef {object} BurialsAppProps
 * @property {object} location - current location object
 * @property {node} children - child components
 *
 * @param {BurialsAppProps} props - Component props
 * @returns {React.Component} - Burials Application
 */
export default function BurialsApp({ location, children }) {
  const {
    loading: isLoadingFeatures,
    burialFormEnabled,
    burialPdfFormAlignment,
  } = useSelector(state => state?.featureToggles);
  const isLoggedIn = useSelector(
    state => state?.user?.login?.currentlyLoggedIn,
  );

  useBrowserMonitoring({
    loggedIn: isLoggedIn,
    toggleName: 'burialBrowserMonitoringEnabled',

    applicationId: '88a7f64b-7f8c-4e26-bef8-55954cab8973',
    clientToken: 'pub2261e01d7a3f40a23796d0b4c256c5bd',
    service: 'benefits-burial',
    version: '1.0.0',

    // record 100% of staging & production sessions; adjust the dashboard
    // retention filters to manage volume & cost
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
  });

  useEffect(
    () => {
      if (!isLoadingFeatures) {
        window.sessionStorage.setItem(
          'showPdfFormAlignment',
          burialPdfFormAlignment,
        );
      }
    },
    [isLoadingFeatures, burialPdfFormAlignment],
  );

  if (isLoadingFeatures) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!burialFormEnabled) {
    if (location.pathname !== '/introduction') {
      window.location.href = '/burials-memorials/veterans-burial-allowance/';
      return <></>;
    }
    return <NoFormPage />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

BurialsApp.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};
