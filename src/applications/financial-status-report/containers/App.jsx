import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MetaTags from 'react-meta-tags';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

import {
  WIZARD_STATUS_NOT_STARTED,
  WIZARD_STATUS_COMPLETE,
  WIZARD_STATUS_RESTARTED,
  restartShouldRedirect,
} from 'platform/site-wide/wizard';
import formConfig from '../config/form';
import { ErrorAlert } from '../components/Alerts';
import WizardContainer from '../wizard/WizardContainer';
import { fetchFormStatus } from '../actions/index';
import { WIZARD_STATUS } from '../wizard/constants';
import {
  fsrWizardFeatureToggle,
  fsrFeatureToggle,
  combinedFSRFeatureToggle,
  enhancedFSRFeatureToggle,
} from '../utils/helpers';

const App = ({
  children,
  formData,
  getFormStatus,
  isError,
  isLoggedIn,
  location,
  pending,
  router,
  setFormData,
  showFSR,
  showCombinedFSR,
  showEnhancedFSR,
  showWizard,
}) => {
  const [wizardState, setWizardState] = useState(
    sessionStorage.getItem(WIZARD_STATUS) || WIZARD_STATUS_NOT_STARTED,
  );

  const setWizardStatus = value => {
    sessionStorage.setItem(WIZARD_STATUS, value);
    setWizardState(value);
  };

  const hasRestarted = () => {
    setWizardStatus(WIZARD_STATUS_RESTARTED);
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_RESTARTED);
    router.push('/');
  };

  useEffect(() => {
    if (restartShouldRedirect(WIZARD_STATUS)) {
      hasRestarted();
    }
  });

  useEffect(
    () => {
      if (showFSR === false) {
        setWizardStatus(WIZARD_STATUS_NOT_STARTED);
      }
    },
    [showFSR],
  );

  useEffect(
    () => {
      getFormStatus();
    },
    [getFormStatus],
  );

  useEffect(
    () => {
      setFormData({
        ...formData,
        'view:combinedFinancialStatusReport': showCombinedFSR,
        'view:enhancedFinancialStatusReport': showEnhancedFSR,
      });
    },
    // Do not add formData to the dependency array, as it will cause an infinite loop. Linter warning will go away when feature flag is deprecated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showCombinedFSR, showEnhancedFSR, setFormData],
  );

  if (pending) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading your information..."
        set-focus
      />
    );
  }

  if (isLoggedIn && isError) {
    return <ErrorAlert />;
  }

  if (showWizard && wizardState !== WIZARD_STATUS_COMPLETE) {
    return (
      <WizardContainer setWizardStatus={setWizardStatus} showFSR={showFSR} />
    );
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

App.propTypes = {
  children: PropTypes.object,
  formData: PropTypes.object,
  getFormStatus: PropTypes.func,
  isError: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  location: PropTypes.object,
  pending: PropTypes.bool,
  router: PropTypes.object,
  setFormData: PropTypes.func,
  showCombinedFSR: PropTypes.bool,
  showEnhancedFSR: PropTypes.bool,
  showFSR: PropTypes.bool,
  showWizard: PropTypes.bool,
};

const mapStateToProps = state => ({
  formData: state.form.data,
  isLoggedIn: state.user.login.currentlyLoggedIn,
  isError: state.fsr.isError,
  pending: state.fsr.pending,
  showWizard: fsrWizardFeatureToggle(state),
  showFSR: fsrFeatureToggle(state),
  showCombinedFSR: combinedFSRFeatureToggle(state),
  showEnhancedFSR: enhancedFSRFeatureToggle(state),
});

const mapDispatchToProps = dispatch => ({
  getFormStatus: () => dispatch(fetchFormStatus()),
  setFormData: data => dispatch(setData(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
