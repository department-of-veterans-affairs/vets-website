import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { checkInExperienceEnabled, loadingFeatureFlags } from '../selectors';

import LandingPage from '../pages/LandingPage';
import ConfirmationPage from '../pages/ConfirmationPage';

import { confirmPath, landingPath } from './routes';

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
        <Router>
          <Switch>
            <Route path={landingPath} component={LandingPage} />
            <Route path={confirmPath} exact component={ConfirmationPage} />
          </Switch>
        </Router>
      </>
    );
  }
};

const mapStateToProps = state => ({
  isCheckInEnabled: checkInExperienceEnabled(state),
  isLoadingFeatureFlags: loadingFeatureFlags(state),
});

export default connect(mapStateToProps)(App);
