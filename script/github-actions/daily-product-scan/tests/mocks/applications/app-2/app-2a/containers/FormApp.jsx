import React from 'react';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import FormFooter from 'platform/forms/components/FormFooter';
import { isLoggedIn, isLOA3 as isLOA3Selector } from 'platform/user/selectors';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';

import formConfig from '../config/form';
import { WIZARD_STATUS, VRE_FORM_NUMBER } from '../constants';
import IdentityNotVerified from '../components/IdentityNotVerified';

const CHAPTER_NAMES = [
  'veteran-information-review',
  'veteran-contact-information',
  'additional-information',
  'communication-preferences',
  'review-and-submit',
  'confirmation',
];

function FormApp(props) {
  const {
    children,
    hasSavedForm,
    isLoading,
    loggedIn,
    location,
    router,
    isIdentityVerified,
  } = props;

  const wizardStatus =
    sessionStorage.getItem(WIZARD_STATUS) === WIZARD_STATUS_COMPLETE;

  const formPath = window.location.pathname.split('/').pop();

  const content = (
    <>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <FormFooter formConfig={formConfig} />
    </>
  );

  if (isLoading) {
    return (
      <va-loading-indicator message="Loading your information..." set-focus />
    );
  }

  // if a user has a saved form but starts a new session, keep them here instead of
  // sending them to the wizard.
  if (loggedIn && hasSavedForm) {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    return content;
  }
  // if a user is logged in but not LOA3, ask them to verify their identity
  if (loggedIn && !isIdentityVerified) {
    return (
      <div className="row vads-u-margin-bottom--2">
        <IdentityNotVerified />
      </div>
    );
  }
  // if a user has not done the wizard, send them there.
  // else if a user is trying to access parts of the form unauthenticated, redirect them to the intro page.
  if (!wizardStatus) {
    router.push('/start');
    return (
      <va-loading-indicator message="Loading VRE Orientation..." set-focus />
    );
  }
  if (!loggedIn && CHAPTER_NAMES.includes(formPath)) {
    router.push('/introduction');
  }
  return content;
}

const mapStateToProps = state => ({
  isIdentityVerified: isLOA3Selector(state),
  loggedIn: isLoggedIn(state),
  isLoading: state?.user?.profile?.loading,
  hasSavedForm: state?.user?.profile?.savedForms.some(
    form => form.form === VRE_FORM_NUMBER,
  ),
});

export default connect(mapStateToProps)(FormApp);
