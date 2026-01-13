import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog/';
import environment from 'platform/utilities/environment';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { setData } from 'platform/forms-system/src/js/actions';
import { VA_FORM_IDS } from 'platform/forms/constants';

import manifest from '../manifest.json';
import formConfig from '../config/form';
import { DOC_TITLE } from '../config/constants';
import {
  processDependents,
  updateDependentsInFormData,
} from '../utils/processDependents';

import { getRootParentUrl } from '../../shared/utils';
import { fetchDependents as fetchDependentsAction } from '../../shared/actions';

/**
 * Render the 686C-674 application
 * @param {object} location - react router location object
 * @param {JSX.Element} children - child components
 * @param {boolean} isLoggedIn - user login status
 * @param {boolean} isLoading - user loading status
 * @param {object} vaFileNumber - VA file number info
 * @param {object} featureToggles - feature toggles object
 * @param {array} savedForms - array of saved forms
 * @param {object} formData - form data from Redux store
 * @param {object} dependents - dependents data from Redux store
 * @param {boolean} isPrefill - whether the form is prefilled
 * @param {function} fetchDependents - action to fetch dependents
 * @param {function} setFormData - action to set form data
 * @returns {JSX.Element} - rendered component
 */
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
  loadedData,
}) {
  // Must match the H1
  document.title = DOC_TITLE;

  const loadingDependents = dependents?.loading;
  const isIntroPage = location?.pathname?.endsWith('/introduction');

  // Determine form flow for v3 release
  // toggle enabled, new form => v3 flow
  // toggle enabled, v3 in progress => v3 flow
  // toggle enabled, v2 in progress => v2 flow
  // toggle disabled => v2 flow
  useEffect(
    () => {
      // Don't analyze flow until we're past the intro page
      // (in-progress form load overwrites form data set ON the intro page)
      if (isLoading || !isLoggedIn || isIntroPage) {
        return;
      }
      // Check v3 feature toggle
      const toggleV3Enabled = featureToggles?.vaDependentsV3 === true;
      // Check for an in-progress form (v2 or v3)
      const hasInProgressForm = savedForms?.some(form =>
        form?.form?.includes(VA_FORM_IDS.FORM_21_686CV2),
      );
      // In-progress form data with saved v3 flag, means it's in v3 flow; so if
      // it's not set, the in-progress form is in v2 flow
      const maybeV2InProgress = loadedData?.formData?.vaDependentsV3 !== true;
      // Flag to stay in V2 flow already set
      const stayInV2Flow = formData.vaDependentV2Flow === true;

      // Lock form into v2 flow if:
      // - If we're not on the intro page
      // - If not already locked into v2 flow
      // - V3 toggle is enabled
      // - there is an in-progress form (v2 or v3)
      // - We detect a possible in-progress v2 form
      if (
        !stayInV2Flow &&
        toggleV3Enabled &&
        hasInProgressForm &&
        maybeV2InProgress
      ) {
        setFormData({
          ...formData,
          vaDependentV2Flow: true,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, isLoggedIn, featureToggles, isIntroPage],
  );

  useEffect(
    () => {
      if (isLoggedIn && !isPrefill && !isIntroPage) {
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
    service: 'benefits-dependents-management',
    version: '1.0.0',

    // record 100% of staging & production sessions; adjust the dashboard
    // retention filters to manage volume & cost
    sessionReplaySampleRate: 100,
    sessionSampleRate: 100,
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
    'vaDependentsNoSSN',
  ]);
  const dependentsModuleEnabled = useToggleValue(
    TOGGLE_NAMES.dependentsModuleEnabled,
  );

  // Handle loading
  if (isLoading) {
    return <va-loading-indicator message="Loading your information..." />;
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
    loadedData: state.form?.loadedData || {},
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
  loadedData: PropTypes.object,
  location: PropTypes.object,
  savedForms: PropTypes.array,
  setFormData: PropTypes.func,
  vaFileNumber: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
