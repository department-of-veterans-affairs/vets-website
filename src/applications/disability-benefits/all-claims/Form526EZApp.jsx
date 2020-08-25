import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from 'platform/user/profile/constants/backendServices';
import {
  WIZARD_STATUS_NOT_STARTED,
  WIZARD_STATUS_COMPLETE,
} from 'applications/static-pages/wizard';

import formConfig from './config/form';
import AddPerson from './containers/AddPerson';
import ITFWrapper from './containers/ITFWrapper';
import { MissingServices, MissingId } from './containers/MissingServices';

import { MVI_ADD_SUCCEEDED } from './actions';
import WizardContainer from './containers/WizardContainer';
import { WIZARD_STATUS } from './constants';
import { show526Wizard } from './utils';

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

export const hasRequiredServices = user =>
  serviceRequired.some(service => user.profile.services.includes(service));

export const hasRequiredId = user =>
  idRequired.some(service => user.profile.services.includes(service));

export const getWizardStatus = () =>
  sessionStorage.getItem(WIZARD_STATUS) || WIZARD_STATUS_NOT_STARTED;

export const Form526Entry = ({ location, user, children, mvi, showWizard }) => {
  const defaultWizardState = getWizardStatus();
  const [wizardState, setWizardState] = useState(defaultWizardState);

  const setWizardStatus = value => {
    window.sessionStorage.setItem(WIZARD_STATUS, value);
    setWizardState(value);
  };

  useEffect(() => {
    if (defaultWizardState === WIZARD_STATUS_COMPLETE) {
      setWizardStatus(WIZARD_STATUS_COMPLETE);
    }
  });
  if (showWizard && wizardState !== WIZARD_STATUS_COMPLETE) {
    return <WizardContainer setWizardStatus={setWizardStatus} />;
  }

  // wraps the app and redirects user if they are not enrolled
  const content = (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );

  // Not logged in, so show the rendered content. The RoutedSavableApp shows
  // an alert with the sign in button
  if (!user.login.currentlyLoggedIn) {
    return content;
  }
  // "add-person" service means the user has a edipi and SSN in the system, but
  // is missing either a BIRLS or participant ID
  if (
    user.profile.services.includes('add-person') &&
    mvi?.addPersonState !== MVI_ADD_SUCCEEDED
  ) {
    return <AddPerson />;
  }

  // RequiredLoginView will handle unverified users by showing the
  // appropriate link
  if (user.profile.verified) {
    // User is missing either their SSN, EDIPI, or BIRLS ID
    if (!hasRequiredId(user)) {
      return <MissingId />;
    }
    // User doesn't have the required services. Show an alert
    if (!hasRequiredServices(user)) {
      return <MissingServices />;
    }
  }

  return (
    <RequiredLoginView serviceRequired={serviceRequired} user={user} verify>
      <ITFWrapper location={location}>{content}</ITFWrapper>
    </RequiredLoginView>
  );
};

const mapStateToProps = state => ({
  user: state.user,
  mvi: state.mvi,
  showWizard: show526Wizard(state),
});

export default connect(mapStateToProps)(Form526Entry);
