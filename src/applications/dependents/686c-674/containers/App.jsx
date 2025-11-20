import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog/';
import environment from 'platform/utilities/environment';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { setData } from 'platform/forms-system/src/js/actions';

import manifest from '../manifest.json';
import formConfig from '../config/form';
import { DOC_TITLE } from '../config/constants';
import { getShouldUseV2 } from '../utils/redirect';
import {
  processDependents,
  updateDependentsInFormData,
} from '../utils/processDependents';

import { getRootParentUrl } from '../../shared/utils';
import { fetchDependents as fetchDependentsAction } from '../../shared/actions';

function App({
  location,
  children,
  isLoggedIn,
  isLoading,
  vaFileNumber,
  featureToggles,
  savedForms,
  formData,
  dependents,
  isPrefill,
  fetchDependents,
  setFormData,
}) {
  // Must match the H1
  document.title = DOC_TITLE;

  const loadingDependents = dependents?.loading;
  const isIntroPage = location?.pathname?.endsWith('/introduction');

  useEffect(
    () => {
      if (isLoggedIn && !isPrefill && isIntroPage) {
        if (loadingDependents) {
          fetchDependents();
        } else {
          const updatedDependents = processDependents({
            dependents,
            isPrefill: false,
          });
          setFormData(updateDependentsInFormData(formData, updatedDependents));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoggedIn, isPrefill, loadingDependents, isIntroPage],
  );

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
    'vaDependentsV3',
  ]);
  const dependentsModuleEnabled = useToggleValue(
    TOGGLE_NAMES.dependentsModuleEnabled,
  );

  // Handle loading
  if (isLoading) {
    return <va-loading-indicator message="Loading your information..." />;
  }

  const flipperV2 = featureToggles.vaDependentsV2;

  if (!getShouldUseV2(flipperV2, savedForms)) {
    window.location.href = `${getRootParentUrl(
      manifest.rootUrl,
    )}/add-remove-form-21-686c/`;
    return <></>;
  }

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

const mapDispatchToProps = {
  fetchDependents: fetchDependentsAction,
  setFormData: setData,
};

const mapStateToProps = state => {
  const { featureToggles, user, vaFileNumber } = state;
  return {
    isLoggedIn: user?.login?.currentlyLoggedIn,
    isLoading: user?.profile?.loading || featureToggles?.loading,
    vaFileNumber,
    featureToggles,
    savedForms: user?.profile?.savedForms,
    formData: state.form?.data || {},
    dependents: state.dependents,
    isPrefill: state.form?.loadedData?.metadata?.prefill || false,
  };
};
App.propTypes = {
  children: PropTypes.node,
  dependents: PropTypes.object,
  featureToggles: PropTypes.object,
  fetchDependents: PropTypes.func,
  formData: PropTypes.object,
  isLoading: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  isPrefill: PropTypes.bool,
  location: PropTypes.object,
  savedForms: PropTypes.array,
  setFormData: PropTypes.func,
  vaFileNumber: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
