import React from 'react';
import { connect } from 'react-redux';

import environment from 'platform/utilities/environment';
import { checkInExperienceEnabled, loadingFeatureFlags } from '../selectors';

const FeatureFlipTest = ({ state }) => {
  if (environment.isProduction()) {
    window.location.replace('/');
    return <></>;
  }
  window.__reduxSnapshot = state;
  return (
    <div>
      <h1>Testing for feature flip issue</h1>
      <a href="https://go.usa.gov/x6Uj3">test url: https://go.usa.gov/x6Uj3</a>
      <h2>current redux state</h2>
      <pre>{JSON.stringify(state, null, 4)}</pre>
    </div>
  );
};

const mapStateToProps = state => ({
  state: {
    ...state,
    isCheckInEnabled: checkInExperienceEnabled(state),
    isLoadingFeatureFlags: loadingFeatureFlags(state),
  },
});

export default connect(mapStateToProps)(FeatureFlipTest);
