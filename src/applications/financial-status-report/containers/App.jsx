import React, { useState, useEffect } from 'react';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import { fetchFormStatus } from '../actions/index';
import { fsrFeatureToggle } from '../utils/helpers';
import WizardContainer from '../wizard/WizardContainer';
import { WIZARD_STATUS } from '../wizard/constants';
import {
  WIZARD_STATUS_NOT_STARTED,
  WIZARD_STATUS_COMPLETE,
} from 'platform/site-wide/wizard';

const App = ({
  location,
  children,
  isError,
  pending,
  isLoggedIn,
  getFormStatus,
  showFSR,
}) => {
  const [wizardState, setWizardState] = useState(
    sessionStorage.getItem(WIZARD_STATUS) || WIZARD_STATUS_NOT_STARTED,
  );

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

  if (pending) {
    return <LoadingIndicator setFocus message="Loading your information..." />;
  }

  if (isLoggedIn && isError) {
    return <ErrorMessage />;
  }

  if (showFSR === false) {
    return window.location.replace('/manage-va-debt');
  }

  if (showFSR && wizardState !== WIZARD_STATUS_COMPLETE) {
    return <WizardContainer setWizardStatus={setWizardStatus} />;
  }

  return showFSR ? (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  ) : null;
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.login.currentlyLoggedIn,
  isError: state.fsr.isError,
  pending: state.fsr.pending,
  showFSR: fsrFeatureToggle(state),
});

const mapDispatchToProps = dispatch => ({
  getFormStatus: () => dispatch(fetchFormStatus()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
