import React, { useEffect } from 'react';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/browser';
import PropTypes from 'prop-types';

import RoutedSavableApp from '@department-of-veterans-affairs/platform-forms/RoutedSavableApp';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import {
  WIZARD_STATUS_COMPLETE,
  WIZARD_STATUS_RESTARTING,
} from '@department-of-veterans-affairs/platform-site-wide/wizard';
import { isLoggedIn } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

import { scrollToTop } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import {
  LOAD_STATUSES,
  SAVE_STATUSES,
} from 'platform/forms/save-in-progress/actions';
import formConfig from './config/form';
import AddPerson from './containers/AddPerson';
import ITFWrapper from './containers/ITFWrapper';
import { MVI_ADD_SUCCEEDED } from './actions';
import {
  DOCUMENT_TITLE_SUFFIX,
  PAGE_TITLE_SUFFIX,
  SHOW_8940_4192,
  WIZARD_STATUS,
  DATA_DOG_TOGGLE,
  DATA_DOG_ID,
  DATA_DOG_TOKEN,
  DATA_DOG_SERVICE,
  DATA_DOG_VERSION,
} from './constants';
import {
  isBDD,
  getPageTitle,
  isExpired,
  show526Wizard,
  showSubform8940And4192,
  wrapWithBreadcrumb,
} from './utils';
import {
  clearBranches,
  fetchBranches,
  getBranches,
} from './utils/serviceBranches';
import { Missing526Identifiers } from './containers/Missing526Identifiers';
import {
  MissingDob,
  MissingId,
  MissingServices,
} from './containers/MissingServices';
import ClaimFormSideNav from './components/ClaimFormSideNav';
import ClaimFormSideNavErrorBoundary from './components/ClaimFormSideNavErrorBoundary';
import {
  trackBackButtonClick,
  trackContinueButtonClick,
  trackSaveFormClick,
  trackFormStarted,
  trackFormResumption,
  trackFormSubmitted,
} from './utils/datadogRumTracking';

// Module-level state holder for tracking callbacks to access current Redux state
// This allows callbacks in formConfig to access runtime state without prop drilling
const runtimeState = {
  featureToggles: {},
  formData: {},
  pathname: '',
};

// Add tracking callbacks to formConfig before routes are created
// These callbacks will read from runtimeState which gets updated by the component
if (!formConfig.formOptions) {
  formConfig.formOptions = {};
}

formConfig.formOptions.onBackClickTracking = () =>
  trackBackButtonClick({
    featureToggles: runtimeState.featureToggles,
    formData: runtimeState.formData,
    pathname: runtimeState.pathname,
  });

formConfig.formOptions.onContinueClickTracking = () =>
  trackContinueButtonClick({
    featureToggles: runtimeState.featureToggles,
    formData: runtimeState.formData,
    pathname: runtimeState.pathname,
  });

formConfig.formOptions.onSaveTracking = () =>
  trackSaveFormClick({
    featureToggles: runtimeState.featureToggles,
    formData: runtimeState.formData,
    pathname: runtimeState.pathname,
  });

// Wrap the original onFormLoaded to add form resumption tracking
const originalOnFormLoaded = formConfig.onFormLoaded;
formConfig.onFormLoaded = props => {
  // Only track form resumption if we're actually loading a saved form
  // Check for saved form metadata and that we're not on the first page
  const isSavedFormResumption =
    props.formData &&
    Object.keys(props.formData).length > 0 &&
    props.returnUrl &&
    props.returnUrl !== '/veteran-information';

  if (isSavedFormResumption) {
    const storageKey = `${formConfig.formId}_formResumptionTracked`;
    const alreadyTracked = sessionStorage.getItem(storageKey) === 'true';

    if (!alreadyTracked) {
      trackFormResumption({
        featureToggles: runtimeState.featureToggles,
        formData: props.formData,
        returnUrl: props.returnUrl,
      });
      sessionStorage.setItem(storageKey, 'true');
    }
  }

  // Call original onFormLoaded
  return originalOnFormLoaded(props);
};

// Wrap the original submit function to add form submission tracking
const originalSubmit = formConfig.submit;
formConfig.submit = (form, formConfigParam, options) => {
  // Call original submit and track on success
  const submitPromise = originalSubmit(form, formConfigParam, options);

  return submitPromise.then(
    result => {
      // Track successful submission - NO PII, only metadata
      trackFormSubmitted({
        featureToggles: runtimeState.featureToggles,
        formData: runtimeState.formData,
        pathname: runtimeState.pathname,
      });

      return result;
    },
    error => {
      // Pass through errors without tracking
      return Promise.reject(error);
    },
  );
};

export const serviceRequired = [
  backendServices.FORM526,
  backendServices.ORIGINAL_CLAIMS,
];

export const idRequired = [
  // checks if EDIPI & SSN exists
  backendServices.EVSS_CLAIMS,
  // checks if EDIPI, SSN & either a BIRLS ID or Participant ID exists
  backendServices.ORIGINAL_CLAIMS,
];

export const hasRequiredServices = profile =>
  serviceRequired.some(service => profile.services.includes(service));

export const hasRequiredId = profile =>
  idRequired.some(service => profile.services.includes(service));

export const hasRequiredDob = profile => !!profile.dob;

const listMissingIdentifiers = profile => {
  // claims.form526RequiredIdentifierPresence is included in the profile when the form_526_required_identifiers_in_user_object feature flag is enabled on the back end
  // We simply check for the presence of it here instead of toggling a feature flag on the front end as well
  const identiferDetail = profile?.claims?.form526RequiredIdentifierPresence;

  // If we do have this information, are any of the identifiers marked false, meaning we are missing that identifer on the back end?
  if (identiferDetail && typeof identiferDetail === 'object') {
    return Object.values(identiferDetail).some(
      idPresence => idPresence === false,
    );
  }

  return false;
};

export const isIntroPage = ({ pathname = '' } = {}) =>
  pathname.endsWith('/introduction');

export const Form526Entry = ({
  children,
  featureToggles,
  form,
  inProgressFormId,
  isBDDForm,
  itf,
  location,
  loggedIn,
  mvi,
  router,
  savedForms,
  setFormData,
  showSubforms,
  showWizard,
  user,
}) => {
  const { profile = {} } = user;
  const wizardStatus = sessionStorage.getItem(WIZARD_STATUS);

  const hasSavedForm = savedForms.some(
    savedForm =>
      savedForm.form === formConfig.formId &&
      !isExpired(savedForm.metaData?.expiresAt),
  );

  // Update module-level runtimeState so formConfig callbacks can access current Redux state
  useEffect(
    () => {
      runtimeState.featureToggles = featureToggles;
      runtimeState.formData = form?.data;
      runtimeState.pathname = location?.pathname;
    },
    [featureToggles, form?.data, location?.pathname],
  );

  // Track when user starts the form from introduction page
  // Only tracks once per session when user navigates to first form page without a saved form
  useEffect(
    () => {
      const isFirstFormPage = location?.pathname === '/veteran-information';
      const hasNoSavedForm = !hasSavedForm;
      const storageKey = `${formConfig.formId}_formStartTracked`;
      const alreadyTracked = sessionStorage.getItem(storageKey) === 'true';

      if (isFirstFormPage && hasNoSavedForm && !alreadyTracked) {
        trackFormStarted({
          featureToggles,
          formData: form?.data,
          pathname: location?.pathname,
        });
        sessionStorage.setItem(storageKey, 'true');
      }
    },
    [location?.pathname, hasSavedForm, featureToggles, form?.data],
  );

  const title = `${getPageTitle(isBDDForm)}${
    isIntroPage(location) ? ` ${PAGE_TITLE_SUFFIX}` : ''
  }`;
  document.title = `${title}${DOCUMENT_TITLE_SUFFIX}`;

  const showLoading = ({ restarting } = {}) => {
    const message = restarting
      ? 'Please wait while we restart the application for you.'
      : 'Please wait while we load the application for you.';
    const label = restarting ? 'restarting' : 'loading';
    return (
      <h1 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
        <va-loading-indicator message={message} label={label} />
      </h1>
    );
  };

  // start focus on breadcrumb nav when wizard is visible
  const setPageFocus = focusTarget => {
    focusElement(focusTarget);
    scrollToTop();
  };

  useEffect(
    () => {
      if (wizardStatus === WIZARD_STATUS_COMPLETE && isIntroPage(location)) {
        setPageFocus('h1');
        // save feature flag for 8940/4192
        sessionStorage.setItem(SHOW_8940_4192, showSubforms);
      }
      // Set user account & application id in Sentry so we can access their form
      // data for any thrown errors
      if (inProgressFormId) {
        Sentry.setTag('account_uuid', profile.accountUuid);
        Sentry.setTag('in_progress_form_id', inProgressFormId);
      }
    },
    [inProgressFormId, location, profile, showSubforms, wizardStatus],
  );

  useEffect(
    () => {
      if (loggedIn && !getBranches().length) {
        fetchBranches();
      }
    },
    [loggedIn],
  );

  const {
    useFormFeatureToggleSync,
    useToggleLoadingValue,
    useToggleValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();
  useFormFeatureToggleSync([
    'disability526Enable2024Form4142',
    'disability526ToxicExposureOptOutDataPurge',
    'disability526SupportingEvidenceEnhancement',
    'disabilityCompNewConditionsWorkflow',
    'disability526ExtraBDDPagesEnabled',
  ]);

  // including this helper to showLoading when feature toggles are loading
  const togglesLoading = useToggleLoadingValue();

  // We don't really need this feature toggle in formData since it's only used here
  const sideNavFeatureEnabled = useToggleValue(
    TOGGLE_NAMES.disability526SidenavEnabled,
  );

  useBrowserMonitoring({
    loggedIn: true,
    toggleName: DATA_DOG_TOGGLE,
    applicationId: DATA_DOG_ID,
    clientToken: DATA_DOG_TOKEN,
    service: DATA_DOG_SERVICE,
    version: DATA_DOG_VERSION,
    // Current recommendation is to record 100% and filter in DD retention filters, since swap to unlimited plan?
    // Will confirm
    sessionReplaySampleRate: 100,
    defaultPrivacyLevel: 'mask',
    beforeSend: event => {
      // Prevent PII from being sent to Datadog with click actions.
      if (event.action?.type === 'click') {
        // eslint-disable-next-line no-param-reassign
        event.action.target.name = 'Clicked item';
      }
      return true;
    },
    // sessionReplaySampleRate: environment.vspEnvironment() === 'staging' ? 100 : 10,
  });

  if (!loggedIn) {
    // clear service branches if not logged in
    clearBranches();
  }

  // The router should be doing this, but we're getting lots of Sentry errors
  // See github.com/department-of-veterans-affairs/va.gov-team/issues/29893
  if (!loggedIn && !isIntroPage(location)) {
    router.push('/introduction');
    return wrapWithBreadcrumb(title, showLoading());
  }

  // showWizard feature flag loads _after_ page has rendered causing the full
  // page content to render, then the wizard to render if this flag is true, so
  // we show a loading indicator until the feature flags are available. This
  // can be removed once the feature flag is removed
  // Including togglesLoading which I think is the intended functionality here we can keep even
  //  after the showWizard is deprecated since it's probably best practice
  if (typeof showWizard === 'undefined' || togglesLoading) {
    return wrapWithBreadcrumb(title, showLoading());
  }

  // showWizard feature flag is initially undefined
  if (
    loggedIn &&
    showWizard &&
    ((!hasSavedForm && wizardStatus !== WIZARD_STATUS_COMPLETE) ||
      (hasSavedForm && wizardStatus === WIZARD_STATUS_RESTARTING))
  ) {
    router.push('/start');
    return wrapWithBreadcrumb(title, showLoading({ restarting: true }));
  }

  // wraps the app and redirects user if they are not enrolled
  const content = (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );

  // Not logged in, so show the rendered content. The RoutedSavableApp shows
  // an alert with the sign in button
  if (!loggedIn) {
    return wrapWithBreadcrumb(title, content);
  }
  // "add-person" service means the user has a edipi and SSN in the system, but
  // is missing either a BIRLS or participant ID
  if (
    profile.services.includes('add-person') &&
    mvi?.addPersonState !== MVI_ADD_SUCCEEDED
  ) {
    return wrapWithBreadcrumb(title, <AddPerson title={title} />);
  }

  // RequiredLoginView will handle unverified users by showing the
  // appropriate link
  if (profile.verified) {
    if (listMissingIdentifiers(profile)) {
      // Render more descriptive Missing526Identifiers component which will replace the misleading MissingDob, MissingId and MissingServices components
      const identifiers = profile.claims.form526RequiredIdentifierPresence;

      return wrapWithBreadcrumb(
        title,
        <Missing526Identifiers
          title={title}
          form526RequiredIdentifiers={identifiers}
        />,
      );
    }

    // EVSS requires user DOB for submission - see #27374
    // To be deprecated in favor of more descriptive Missing526Identifiers component
    if (!hasRequiredDob(profile)) {
      return wrapWithBreadcrumb(title, <MissingDob title={title} />);
    }
    // User is missing either their SSN, EDIPI, or BIRLS ID
    // To be deprecated in favor of more descriptive Missing526Identifiers component
    if (!hasRequiredId(profile)) {
      return wrapWithBreadcrumb(title, <MissingId title={title} />);
    }
    // User doesn't have the required services. Show an alert
    // To be deprecated in favor of more descriptive Missing526Identifiers component
    if (!hasRequiredServices(profile)) {
      return wrapWithBreadcrumb(title, <MissingServices title={title} />);
    }
  }

  // SideNav MVP functionality
  if (sideNavFeatureEnabled) {
    const hideNavPaths = [
      '/confirmation',
      '/form-saved',
      '/introduction',
      '/start',
    ];

    const pathname = location?.pathname?.replace(/\/+$/, '') || '';
    const loadedStatus = form?.loadedStatus;
    const savedStatus = form?.savedStatus;
    const isFormDataLoaded =
      loadedStatus === LOAD_STATUSES.success ||
      loadedStatus === LOAD_STATUSES.notAttempted;
    const isFormSaving = savedStatus === SAVE_STATUSES.pending;

    const shouldHideNav =
      hideNavPaths.some(p => pathname.endsWith(p)) ||
      !itf?.messageDismissed ||
      !isFormDataLoaded ||
      isFormSaving;
    const contentHiddenSideNavClass = shouldHideNav
      ? ``
      : ` medium-screen:vads-grid-col-9`;

    return wrapWithBreadcrumb(
      title,
      <article
        className="vads-grid-container"
        id="form-526"
        data-location={`${location?.pathname?.slice(1)}`}
      >
        <div className="vads-grid-row vads-u-margin-x--neg2p5">
          {shouldHideNav ? null : (
            <div className="vads-u-padding-x--2p5 vads-u-padding-bottom--3 vads-grid-col-12 medium-screen:vads-grid-col-3">
              <ClaimFormSideNavErrorBoundary
                pathname={pathname}
                formData={form?.data}
              >
                <ClaimFormSideNav
                  enableAnalytics
                  formData={form?.data}
                  pathname={pathname}
                  router={router}
                  setFormData={setFormData}
                />
              </ClaimFormSideNavErrorBoundary>
            </div>
          )}
          <div
            className={`vads-u-padding-x--2p5 vads-grid-col-12${contentHiddenSideNavClass}`}
          >
            <RequiredLoginView
              serviceRequired={serviceRequired}
              user={user}
              verify
            >
              <ITFWrapper location={location} title={title}>
                {content}
              </ITFWrapper>
            </RequiredLoginView>
          </div>
        </div>
      </article>,
    );
  }

  return wrapWithBreadcrumb(
    title,
    <article id="form-526" data-location={`${location?.pathname?.slice(1)}`}>
      <RequiredLoginView serviceRequired={serviceRequired} user={user} verify>
        <ITFWrapper location={location} title={title}>
          {content}
        </ITFWrapper>
      </RequiredLoginView>
    </article>,
  );
};

Form526Entry.propTypes = {
  accountUuid: PropTypes.string,
  children: PropTypes.any,
  featureToggles: PropTypes.object,
  form: PropTypes.shape({
    data: PropTypes.object,
    loadedStatus: PropTypes.string,
    savedStatus: PropTypes.string,
  }),
  inProgressFormId: PropTypes.number,
  isBDDForm: PropTypes.bool,
  isStartingOver: PropTypes.bool,
  itf: PropTypes.shape({
    messageDismissed: PropTypes.bool,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  loggedIn: PropTypes.bool,
  mvi: PropTypes.shape({
    addPersonState: PropTypes.string,
  }),
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  savedForms: PropTypes.array,
  setFormData: PropTypes.func,
  showSubforms: PropTypes.bool,
  showWizard: PropTypes.bool,
  user: PropTypes.shape({
    profile: PropTypes.shape({}),
  }),
};

const mapStateToProps = state => ({
  accountUuid: state?.user?.profile?.accountUuid,
  featureToggles: toggleValues(state),
  form: state?.form,
  inProgressFormId: state?.form?.loadedData?.metadata?.inProgressFormId,
  isBDDForm: isBDD(state?.form?.data),
  isStartingOver: state.form?.isStartingOver,
  itf: state.itf,
  loggedIn: isLoggedIn(state),
  mvi: state.mvi,
  savedForms: state?.user?.profile?.savedForms || [],
  showSubforms: showSubform8940And4192(state),
  showWizard: show526Wizard(state),
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  setFormData: data => dispatch(setData(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form526Entry);
