import React, { useState, useEffect } from 'react';
import MetaTags from 'react-meta-tags';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { connect } from 'react-redux';
import {
  WIZARD_STATUS_NOT_STARTED,
  WIZARD_STATUS_COMPLETE,
} from 'platform/site-wide/wizard';

import formConfig from '../config/form';
import ErrorMessage from '../components/ErrorMessage';
import WizardContainer from '../wizard/WizardContainer';
import { fetchFormStatus } from '../actions/index';
import { WIZARD_STATUS } from '../wizard/constants';
import { fsrWizardFeatureToggle, fsrFeatureToggle } from '../utils/helpers';

const App = ({
  location,
  children,
  isError,
  pending,
  isLoggedIn,
  getFormStatus,
  showWizard,
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

  if (showWizard && wizardState !== WIZARD_STATUS_COMPLETE) {
    return <WizardContainer setWizardStatus={setWizardStatus} />;
  }

  return showFSR ? (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <MetaTags>
        {/* TODO: used to prevent staging form being indexed remove once merged to prod */}
        <meta name="robots" content="noindex" />
        <meta
          name="keywords"
          content="repay debt, debt, debt letters, FSR, financial status report, debt forgiveness, compromise, waiver, monthly offsets, education loans repayment"
        />
      </MetaTags>

      {children}
    </RoutedSavableApp>
  ) : null;
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.login.currentlyLoggedIn,
  isError: state.fsr.isError,
  pending: state.fsr.pending,
  showWizard: fsrWizardFeatureToggle(state),
  showFSR: fsrFeatureToggle(state),
});

const mapDispatchToProps = dispatch => ({
  getFormStatus: () => dispatch(fetchFormStatus()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
