import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';

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
import { show526Wizard, isBDD, getPageTitle } from './utils';

const wrapInBreadcrumb = (title, component) => (
  <>
    <Breadcrumbs>
      <a href="/">Home</a>
      <a href="/disability">Disability Benefits</a>
      <span className="vads-u-color--black">
        <strong>{title}</strong>
      </span>
    </Breadcrumbs>
    {component}
  </>
);

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

export const Form526Entry = ({
  location,
  user,
  children,
  mvi,
  showWizard,
  isBDDForm,
}) => {
  const defaultWizardState = getWizardStatus();
  const [wizardState, setWizardState] = useState(defaultWizardState);

  const title = getPageTitle(isBDDForm);
  document.title = title;

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
    return wrapInBreadcrumb(
      title,
      <WizardContainer setWizardStatus={setWizardStatus} />,
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
  if (!user.login.currentlyLoggedIn) {
    return wrapInBreadcrumb(title, content);
  }
  // "add-person" service means the user has a edipi and SSN in the system, but
  // is missing either a BIRLS or participant ID
  if (
    user.profile.services.includes('add-person') &&
    mvi?.addPersonState !== MVI_ADD_SUCCEEDED
  ) {
    return wrapInBreadcrumb(title, <AddPerson title={title} />);
  }

  // RequiredLoginView will handle unverified users by showing the
  // appropriate link
  if (user.profile.verified) {
    // User is missing either their SSN, EDIPI, or BIRLS ID
    if (!hasRequiredId(user)) {
      return wrapInBreadcrumb(title, <MissingId title={title} />);
    }
    // User doesn't have the required services. Show an alert
    if (!hasRequiredServices(user)) {
      return wrapInBreadcrumb(title, <MissingServices title={title} />);
    }
  }

  return wrapInBreadcrumb(
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
  user: state.user,
  mvi: state.mvi,
  showWizard: show526Wizard(state),
  isBDDForm: isBDD(state?.form?.data),
});

export default connect(mapStateToProps)(Form526Entry);
