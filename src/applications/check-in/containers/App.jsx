import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { checkInExperienceEnabled, loadingFeatureFlags } from '../selectors';

import LandingPage from '../pages/LandingPage';

const App = ({ isCheckInEnabled, isLoadingFeatureFlags }) => {
  if (isLoadingFeatureFlags) {
    return (
      <>
        <LoadingIndicator />
      </>
    );
  } else if (!isCheckInEnabled) {
    window.location.replace('/');
    return <></>;
  } else {
    return (
      <>
        <meta name="robots" content="noindex" />
        <LandingPage />
      </>
    );
  }
};

const mapStateToProps = state => ({
  isCheckInEnabled: checkInExperienceEnabled(state),
  isLoadingFeatureFlags: loadingFeatureFlags(state),
});

export default connect(mapStateToProps)(App);
