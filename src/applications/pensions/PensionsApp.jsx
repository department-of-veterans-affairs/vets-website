import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import IntentToFile from 'platform/shared/itf/IntentToFile';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog/';

import manifest from './manifest.json';
import formConfig from './config/form';
import { NoFormPage } from './components/NoFormPage';

/**
 * Pensions Application
 * @typedef {object} PensionsAppProps
 * @property {object} location - current location object
 * @property {node} children - child components
 *
 * @param {PensionsAppProps} props - Component props
 * @returns {React.Component} - Pensions Application
 */
export default function PensionEntry({ location, children }) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const pensionFormEnabled = useToggleValue(TOGGLE_NAMES.pensionFormEnabled);
  const pensionMultiplePageResponse = useToggleValue(
    TOGGLE_NAMES.pensionMultiplePageResponse,
  );
  const pensionPdfFormAlignment = useToggleValue(
    TOGGLE_NAMES.pensionPdfFormAlignment,
  );
  const isLoadingFeatures = useSelector(
    state => state?.featureToggles?.loading,
  );
  const isLoggedIn = useSelector(
    state => state?.user?.login?.currentlyLoggedIn,
  );
  const redirectToHowToPage =
    pensionFormEnabled === false &&
    !location.pathname?.includes('/introduction');
  if (redirectToHowToPage === true) {
    window.location.href = '/pension/survivors-pension/';
  }

  // Add Datadog UX monitoring to the application
  useBrowserMonitoring({
    loggedIn: isLoggedIn,
    toggleName: 'pensionsBrowserMonitoringEnabled',

    applicationId: 'b3319250-eeb3-419c-b596-3422aec52e4d',
    clientToken: 'pubd03b9c29b16b25a9fa3ba5cbe8670658',
    service: 'benefits-pension',
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
          'showMultiplePageResponse',
          pensionMultiplePageResponse,
        );
        window.sessionStorage.setItem(
          'showPdfFormAlignment',
          pensionPdfFormAlignment,
        );
      }
    },
    [isLoadingFeatures, pensionMultiplePageResponse, pensionPdfFormAlignment],
  );

  if (isLoadingFeatures !== false || redirectToHowToPage) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!pensionFormEnabled) {
    return <NoFormPage />;
  }

  const content = (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <IntentToFile itfType="pension" location={location} disableAutoFocus />
      {children}
    </RoutedSavableApp>
  );

  // If on intro page, return content
  if (location.pathname === '/introduction') {
    return content;
  }

  // If a user is not logged in redirect them to the introduction page
  if (!isLoggedIn) {
    document.location.replace(manifest.rootUrl);
    return (
      <va-loading-indicator message="Redirecting to introduction page..." />
    );
  }

  return content;
}
PensionEntry.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};
