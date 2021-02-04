import React, { useState, useEffect } from 'react';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import { fetchFormStatus } from '../actions/index';

import WizardContainer from '../wizard/WizardContainer';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_NOT_STARTED,
  WIZARD_STATUS_COMPLETE,
} from 'applications/static-pages/wizard';

const App = ({
  location,
  children,
  isError,
  pending,
  isLoggedIn,
  getFormStatus,
}) => {
  const showMainContent = !pending && !isError;
  const showWizard = true;
  const defaultWizardState =
    sessionStorage.getItem(WIZARD_STATUS) || WIZARD_STATUS_NOT_STARTED;

  const [wizardState, setWizardState] = useState(defaultWizardState);

  const setWizardStatus = value => {
    sessionStorage.setItem(WIZARD_STATUS, value);
    setWizardState(value);
  };

  useEffect(
    () => {
      getFormStatus();
    },
    [getFormStatus],
  );

  if (showWizard && wizardState !== WIZARD_STATUS_COMPLETE) {
    return <WizardContainer setWizardStatus={setWizardStatus} />;
  }

  return (
    <>
      {pending && (
        <LoadingIndicator setFocus message="Loading your information..." />
      )}
      {isError &&
        !pending &&
        isLoggedIn && (
          <div className="row vads-u-margin-bottom--3">
            <ErrorMessage />
          </div>
        )}
      {showMainContent && (
        <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
          {children}
        </RoutedSavableApp>
      )}
    </>
  );
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.login.currentlyLoggedIn,
  isError: state.fsr.isError,
  pending: state.fsr.pending,
});

const mapDispatchToProps = dispatch => ({
  getFormStatus: () => dispatch(fetchFormStatus()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
