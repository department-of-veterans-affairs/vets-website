import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog/';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { openReviewChapter as openReviewChapterAction } from 'platform/forms-system/src/js/actions';

import manifest from '../manifest.json';
import formConfig from '../config/form';
import { NoFormPage } from '../components/NoFormPage';
import { getAssetTypes } from '../components/FormAlerts/SupplementaryFormsAlert';
import { hasIncompleteTrust, shouldShowDeclinedAlert } from '../helpers';

/**
 * Income and Asset Statement Application
 * @typedef {object} IncomeAndAssetStatementAppProps
 * @property {object} location - current location object
 * @property {node} children - child components
 * @property {boolean} isLoggedIn - user login status
 * @property {function} openReviewChapter - action to open a chapter on review & submit page
 *
 * @param {IncomeAndAssetStatementAppProps} props - Component props
 * @returns {React.Component} - Income and Asset Statement Application
 */
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
  const trusts = useSelector(state => state?.form?.data?.trusts || []);
  const [assetsChecked, setAssetsChecked] = useState(false);

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
    service: 'benefits-income-and-assets',
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
          'showUpdatedContent',
          !!incomeAndAssetsContentUpdates,
        );
      }
    },
    [isLoadingFeatures, incomeAndAssetsContentUpdates],
  );

  useEffect(
    () => {
      // Use assetsChecked flag to prevent infinite loop
      if (!assetsChecked && location.pathname === '/review-and-submit') {
        const assetTypes = getAssetTypes(assets);
        setAssetsChecked(true);
        if (
          assets.length > 0 &&
          assetTypes.length > 0 &&
          shouldShowDeclinedAlert(assets)
        ) {
          openReviewChapter('ownedAssets');
        }
        if (hasIncompleteTrust(trusts)) {
          openReviewChapter('trusts');
        }
      }
    },
    [assetsChecked, location.pathname, assets, trusts, openReviewChapter],
  );

  if (isLoadingFeatures) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (!incomeAndAssetsFormEnabled) {
    return <NoFormPage />;
  }

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
