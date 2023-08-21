import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/browser';
import PropTypes from 'prop-types';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';
import {
  WIZARD_STATUS_COMPLETE,
  WIZARD_STATUS_RESTARTING,
} from 'platform/site-wide/wizard';
import { isLoggedIn } from 'platform/user/selectors';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import formConfig from './config/form';
import AddPerson from './containers/AddPerson';
import ITFWrapper from './containers/ITFWrapper';
import { MVI_ADD_SUCCEEDED } from './actions';
import {
  WIZARD_STATUS,
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
import {
  getBranches,
  fetchBranches,
  clearBranches,
} from './utils/serviceBranches';
import { Missing526Identifiers } from './containers/Missing526Identifiers';

export const serviceRequired = [
  backendServices.FORM526,
  backendServices.ORIGINAL_CLAIMS,
];

const missingRequiredIdentifiers = profile => {
  return Object.values(profile.claims.form526RequiredIdentifers).some(
    idPresence => idPresence === false,
  );
};

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
      }
      // Set user account & application id in Sentry so we can access their form
      // data for any thrown errors
      if (inProgressFormId) {
        Sentry.setTag('account_uuid', profile.accountUuid);
        Sentry.setTag('in_progress_form_id', inProgressFormId);
      }
    },
    [showSubforms, wizardStatus, inProgressFormId, profile, location],
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

  if (profile.verified && missingRequiredIdentifiers(profile)) {
    const identifiers = profile.claims.form526RequiredIdentifers;
    return wrapWithBreadcrumb(
      title,
      <Missing526Identifiers
        title={title}
        form526RequiredIdentifers={identifiers}
      />,
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
