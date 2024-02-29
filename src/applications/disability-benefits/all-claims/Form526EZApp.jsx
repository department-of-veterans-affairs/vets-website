import React, { useEffect } from 'react';
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

import scrollToTop from '@department-of-veterans-affairs/platform-utilities/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import formConfig from './config/form';
import AddPerson from './containers/AddPerson';
import ITFWrapper from './containers/ITFWrapper';
import {
  MissingServices,
  MissingId,
  MissingDob,
} from './containers/MissingServices';

import { MVI_ADD_SUCCEEDED } from './actions';
import {
  DOCUMENT_TITLE_SUFFIX,
  PAGE_TITLE_SUFFIX,
  SHOW_8940_4192,
  SHOW_TOXIC_EXPOSURE,
  WIZARD_STATUS,
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

export const isIntroPage = ({ pathname = '' } = {}) =>
  pathname.endsWith('/introduction');

export const Form526Entry = ({
  children,
  inProgressFormId,
  isBDDForm,
  location,
  loggedIn,
  mvi,
  router,
  savedForms,
  showSubforms,
  showWizard,
  user,
}) => {
  const { profile = {} } = user;
  const wizardStatus = sessionStorage.getItem(WIZARD_STATUS);
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const showToxicExposurePages = useToggleValue(
    TOGGLE_NAMES.disability526ToxicExposure,
  );
  const hasSavedForm = savedForms.some(
    form =>
      form.form === formConfig.formId && !isExpired(form.metaData?.expiresAt),
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

        // save feature flag for Toxic Exposure pages
        sessionStorage.setItem(SHOW_TOXIC_EXPOSURE, showToxicExposurePages);
      }
      // Set user account & application id in Sentry so we can access their form
      // data for any thrown errors
      if (inProgressFormId) {
        Sentry.setTag('account_uuid', profile.accountUuid);
        Sentry.setTag('in_progress_form_id', inProgressFormId);
      }
    },
    [
      inProgressFormId,
      location,
      profile,
      showSubforms,
      showToxicExposurePages,
      wizardStatus,
    ],
  );

  useEffect(
    () => {
      if (loggedIn && !getBranches().length) {
        fetchBranches();
      }
    },
    [loggedIn],
  );

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
  if (typeof showWizard === 'undefined') {
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
    // EVSS requires user DOB for submission - see #27374
    if (!hasRequiredDob(profile)) {
      return wrapWithBreadcrumb(title, <MissingDob title={title} />);
    }
    // User is missing either their SSN, EDIPI, or BIRLS ID
    if (!hasRequiredId(profile)) {
      return wrapWithBreadcrumb(title, <MissingId title={title} />);
    }
    // User doesn't have the required services. Show an alert
    if (!hasRequiredServices(profile)) {
      return wrapWithBreadcrumb(title, <MissingServices title={title} />);
    }
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
  inProgressFormId: PropTypes.number,
  isBDDForm: PropTypes.bool,
  isStartingOver: PropTypes.bool,
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
  showSubforms: PropTypes.bool,
  showWizard: PropTypes.bool,
  user: PropTypes.shape({
    profile: PropTypes.shape({}),
  }),
};

const mapStateToProps = state => ({
  accountUuid: state?.user?.profile?.accountUuid,
  inProgressFormId: state?.form?.loadedData?.metadata?.inProgressFormId,
  isBDDForm: isBDD(state?.form?.data),
  isStartingOver: state.form?.isStartingOver,
  loggedIn: isLoggedIn(state),
  mvi: state.mvi,
  savedForms: state?.user?.profile?.savedForms || [],
  showSubforms: showSubform8940And4192(state),
  showWizard: show526Wizard(state),
  user: state.user,
});

export default connect(mapStateToProps)(Form526Entry);
