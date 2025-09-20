import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog/';
import environment from 'platform/utilities/environment';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import manifestV2 from './v2/manifest.json';
import formConfigV2 from './v2/config/form';
import manifestV3 from './v3/manifest.json';
import formConfigV3 from './v3/config/form';

import { DOC_TITLE } from './v2/config/constants';
// import { getShouldUseV2 } from './v2/utils/redirect';
import { getRootParentUrl } from '../shared/utils';

// console.log('📦 Webpack imports check:', {
//   v2Manifest: manifestV2?.rootUrl,
//   v3Manifest: manifestV3?.rootUrl,
//   v2Title: formConfigV2?.title,
//   v3Title: formConfigV3?.title,
// });

function App({
  location,
  children,
  isLoggedIn,
  isLoading,
  vaFileNumber,
  featureToggles,
  // savedForms,
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

  const {
    useFormFeatureToggleSync,
    useToggleValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();
  useFormFeatureToggleSync([
    'vaDependentsNetWorthAndPension',
    'vaDependentsDuplicateModals',
  ]);
  const dependentsModuleEnabled = useToggleValue(
    TOGGLE_NAMES.dependentsModuleEnabled,
  );

  // Handle loading
  if (isLoading) {
    return <va-loading-indicator message="Loading your information..." />;
  }

  const flipperV3 = featureToggles.vaDependentsV3;

  // Conditionally select manifest and form config based on flipper
  const manifest = flipperV3 ? manifestV3 : manifestV2;
  const formConfig = flipperV3 ? formConfigV3 : formConfigV2;

  // console.log('🔧 Flipper debug:', {
  //   flipperV3,
  //   featureToggles,
  //   selectedManifest: manifest?.rootUrl,
  //   selectedFormTitle: formConfig?.title,
  //   usingV3: flipperV3 ? 'YES' : 'NO',
  // });

  // console.log('flipperV3', flipperV3);
  // console.log(formConfig);

  // if (!getShouldUseV2(flipperV2, savedForms)) {
  //   window.location.href = `/${manifest.rootUrl}/add-remove-form-21-686c/`;
  //   return <></>;
  // }

  const breadcrumbs = [
    { href: '/', label: 'Home' },
    {
      href: getRootParentUrl(manifest.rootUrl),
      label: 'Manage dependents for disability, pension, or DIC benefits',
    },
    {
      href: `/${manifest.rootUrl}/add-remove-form-21-686c-674/introduction`,
      label: 'Add or remove dependents on VA benefits',
    },
  ];
  const rawBreadcrumbs = JSON.stringify(breadcrumbs);
  formConfig.submitUrl = dependentsModuleEnabled
    ? `${environment.API_URL}/dependents_benefits/v0/claims`
    : `${environment.API_URL}/v0/dependents_applications`;

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
