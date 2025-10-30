import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog/';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import environment from 'platform/utilities/environment';
import { openReviewChapter as openReviewChapterAction } from 'platform/forms-system/src/js/actions';

import formConfig from '../config/form';
import { NoFormPage } from '../components/NoFormPage';
import { getAssetTypes } from '../components/FormAlerts/SupplementaryFormsAlert';

function App({ location, children, isLoggedIn, openReviewChapter }) {
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
  const assets = useSelector(state => state?.form?.data?.ownedAssets || []);

  const content = (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
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

  useEffect(
    () => {
      if (location.pathname === '/review-and-submit') {
        const assetTypes = getAssetTypes(assets);
        if (assets.length > 0 && assetTypes.length > 0) {
          // auto-open "Property and business" accordion on review & submit page
          openReviewChapter('ownedAssets');
        }
      }
    },
    [location, assets, openReviewChapter],
  );

  if (isLoadingFeatures) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!incomeAndAssetsFormEnabled) {
    return <NoFormPage />;
  }

  return content;
}

const mapStateToProps = state => {
  const { user } = state;
  return {
    isLoggedIn: user?.login?.currentlyLoggedIn,
  };
};

const mapDispatchToProps = {
  openReviewChapter: openReviewChapterAction,
};

App.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool,
  openReviewChapter: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
