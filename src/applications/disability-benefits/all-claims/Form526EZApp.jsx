import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/browser';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';
import {
  WIZARD_STATUS_COMPLETE,
  WIZARD_STATUS_RESTARTING,
} from 'platform/site-wide/wizard';
import { isLoggedIn } from 'platform/user/selectors';

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
  WIZARD_STATUS,
  PDF_SIZE_FEATURE,
  SHOW_8940_4192,
  PAGE_TITLE_SUFFIX,
  DOCUMENT_TITLE_SUFFIX,
} from './constants';
import {
  show526Wizard,
  isBDD,
  getPageTitle,
  showSubform8940And4192,
  wrapWithBreadcrumb,
  isExpired,
} from './utils';
import { uploadPdfLimitFeature } from './config/selectors';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';

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

const isIntroPage = () => window.location.pathname.endsWith('/introduction');

export const Form526Entry = ({
  children,
  inProgressFormId,
  isBDDForm,
  location,
  loggedIn,
  mvi,
  pdfLimit,
  router,
  savedForms,
  showSubforms,
  showWizard,
  user,
}) => {
  const { profile = {} } = user;
  const wizardStatus = sessionStorage.getItem(WIZARD_STATUS);

  const hasSavedForm = savedForms.some(
    form =>
      form.form === formConfig.formId && !isExpired(form.metaData?.expiresAt),
  );

  const title = `${getPageTitle(isBDDForm)}${
    isIntroPage() ? ` ${PAGE_TITLE_SUFFIX}` : ''
  }`;
  document.title = `${title}${DOCUMENT_TITLE_SUFFIX}`;

  // start focus on breadcrumb nav when wizard is visible
  const setPageFocus = focusTarget => {
    focusElement(focusTarget);
    scrollToTop();
  };

  useEffect(
    () => {
      if (wizardStatus === WIZARD_STATUS_COMPLETE && isIntroPage()) {
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
    [showSubforms, wizardStatus, inProgressFormId, profile],
  );

  // showWizard feature flag loads _after_ page has rendered causing the full
  // page content to render, then the wizard to render if this flag is true, so
  // we show a loading indicator until the feature flags are available. This
  // can be removed once the feature flag is removed
  if (typeof showWizard === 'undefined') {
    return wrapWithBreadcrumb(
      title,
      <h1 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
        <LoadingIndicator message="Please wait while we load the application for you." />
      </h1>,
    );
  }

  // showWizard feature flag is initially undefined
  if (
    loggedIn &&
    showWizard &&
    ((!hasSavedForm && wizardStatus !== WIZARD_STATUS_COMPLETE) ||
      (hasSavedForm && wizardStatus === WIZARD_STATUS_RESTARTING))
  ) {
    router.push('/start');
    return wrapWithBreadcrumb(
      title,
      <h1>
        <LoadingIndicator message="Please wait while we restart the application for you." />
      </h1>,
    );
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

  // No easy method to pass a feature flag setting to a uiSchema, so we'll use
  // sessionStorage for now. Done here because continuing an application may
  // bypass the intro page.
  sessionStorage.setItem(PDF_SIZE_FEATURE, pdfLimit);

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

const mapStateToProps = state => ({
  accountUuid: state?.user?.profile?.accountUuid,
  inProgressFormId: state?.form?.loadedData?.metadata?.inProgressFormId,
  isBDDForm: isBDD(state?.form?.data),
  isStartingOver: state.form?.isStartingOver,
  loggedIn: isLoggedIn(state),
  mvi: state.mvi,
  pdfLimit: uploadPdfLimitFeature(state),
  savedForms: state?.user?.profile?.savedForms || [],
  showSubforms: showSubform8940And4192(state),
  showWizard: show526Wizard(state),
  user: state.user,
});

export default connect(mapStateToProps)(Form526Entry);
