import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog/';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import environment from 'platform/utilities/environment';
import formConfig from '../config/form';
import { NoFormPage } from '../components/NoFormPage';

function App({ location, children, isLoggedIn }) {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const incomeAndAssetsFormEnabled = useToggleValue(
    TOGGLE_NAMES.incomeAndAssetsFormEnabled,
  );

  const incomeAndAssetsContentUpdates = useToggleValue(
    TOGGLE_NAMES.incomeAndAssetsContentUpdates,
  );

  const isLoadingFeatures = useSelector(
    state => state?.featureToggles?.loading ?? false,
  );

  // Add Datadog UX monitoring to the application
  useBrowserMonitoring({
    loggedIn: isLoggedIn,
    toggleName: 'incomeAndAssetsBrowserMonitoringEnabled',
    applicationId: '58e7ffff-9710-46f0-bf72-bf1f7b0f1ba4',
    clientToken: 'puba95e30e73b0bae094ea212fca3870ef3',
    // `site` refers to the Datadog site parameter of your organization
    // see https://docs.datadoghq.com/getting_started/site/
    service: 'benefits-income-and-assets',
    version: '1.0.0',
    // record 100% of staging sessions, but only 20% of production
    sessionReplaySampleRate:
      environment.vspEnvironment() === 'staging' ? 100 : 20,
    sessionSampleRate: 100,
    defaultPrivacyLevel: 'mask-user-input',
  });

  useEffect(
    () => {
      if (!isLoadingFeatures) {
        window.sessionStorage.setItem(
          'showUpdatedContent',
          !!incomeAndAssetsContentUpdates,
        );
      }
    },
    [isLoadingFeatures, incomeAndAssetsContentUpdates],
  );

  if (isLoadingFeatures) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!incomeAndAssetsFormEnabled) {
    return <NoFormPage />;
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => {
  const { user } = state;
  return {
    isLoggedIn: user?.login?.currentlyLoggedIn,
  };
};

App.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,
};

export default connect(mapStateToProps)(App);
