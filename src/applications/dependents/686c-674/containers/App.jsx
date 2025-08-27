import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog/';
import environment from 'platform/utilities/environment';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import manifest from '../manifest.json';
import formConfig from '../config/form';
import { DOC_TITLE } from '../config/constants';
import { getShouldUseV2 } from '../utils/redirect';

function App({
  location,
  children,
  isLoggedIn,
  isLoading,
  vaFileNumber,
  featureToggles,
  savedForms,
}) {
  // Must match the H1
  document.title = DOC_TITLE;

  // Add Datadog UX monitoring to the application
  // Source: https://dsva.slack.com/archives/C05SGJEAJ65/p1747141625272269?thread_ts=1746723992.073429&cid=C05SGJEAJ65
  useBrowserMonitoring({
    loggedIn: isLoggedIn,
    toggleName: 'vaDependentsBrowserMonitoringEnabled',

    applicationId: '48416fb2-5b5e-428c-a1b1-b6e83b7c4088',
    clientToken: 'pubd3c0ed031341634412d7af1c9abf2a30',
    // `site` refers to the Datadog site parameter of your organization
    // see https://docs.datadoghq.com/getting_started/site/
    service: 'benefits-dependents-management',
    version: '1.0.0',
    // record 100% of staging sessions, but only 20% of production
    sessionReplaySampleRate:
      environment.vspEnvironment() === 'staging' ? 100 : 20,
    sessionSampleRate: 50,
  });

  const { useFormFeatureToggleSync } = useFeatureToggle();
  useFormFeatureToggleSync(['vaDependentsNetWorthAndPension']);

  // Handle loading
  if (isLoading) {
    return <va-loading-indicator message="Loading your information..." />;
  }

  const flipperV2 = featureToggles.vaDependentsV2;

  if (!getShouldUseV2(flipperV2, savedForms)) {
    window.location.href = `/${manifest.rootUrl}/add-remove-form-21-686c/`;
    return <></>;
  }

  const breadcrumbs = [
    { href: '/', label: 'Home' },
    {
      href: `/${manifest.rootUrl}`,
      label: 'View or change dependents on your VA disability benefits',
    },
    {
      href: `/${manifest.rootUrl}/add-remove-form-21-686c-674/introduction`,
      label: 'Add or remove dependents on VA benefits',
    },
  ];
  const rawBreadcrumbs = JSON.stringify(breadcrumbs);

  const content = (
    <article id="form-686c" data-location={`${location?.pathname?.slice(1)}`}>
      <div className="row">
        <div className="columns">
          <va-breadcrumbs breadcrumb-list={rawBreadcrumbs} wrapping />
        </div>
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </article>
  );

  // If on intro page, just return
  if (location.pathname === '/introduction') {
    return content;
  }

  // If a user is not logged in OR
  // a user is logged in, but hasn't gone through va file number validation
  // redirect them to the introduction page.
  if (
    !isLoggedIn ||
    (isLoggedIn && !vaFileNumber?.hasVaFileNumber?.VALIDVAFILENUMBER)
  ) {
    document.location.replace(manifest.rootUrl);
    return (
      <va-loading-indicator message="Redirecting to introduction page..." />
    );
  }

  return content;
}

const mapStateToProps = state => {
  const { featureToggles, user, vaFileNumber } = state;
  return {
    isLoggedIn: user?.login?.currentlyLoggedIn,
    isLoading: user?.profile?.loading || featureToggles?.loading,
    vaFileNumber,
    featureToggles,
    savedForms: user?.profile?.savedForms,
  };
};
App.propTypes = {
  children: PropTypes.node,
  featureToggles: PropTypes.object,
  isLoading: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  location: PropTypes.object,
  savedForms: PropTypes.array,
  vaFileNumber: PropTypes.object,
};

export default connect(mapStateToProps)(App);
