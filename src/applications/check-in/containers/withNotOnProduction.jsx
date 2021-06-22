import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import environment from 'platform/utilities/environment';

import { checkInExperienceEnabled, loadingFeatureFlags } from '../selectors';

const withNotOnProduction = WrappedComponent => props => {
  if (environment.isProduction()) {
    window.location.replace('/');
    return <></>;
  } else {
    return <WrappedComponent {...props} />;
  }
};
const mapStateToProps = state => ({
  isCheckInEnabled: checkInExperienceEnabled(state),
  isLoadingFeatureFlags: loadingFeatureFlags(state),
});

const composedWrapper = compose(
  connect(mapStateToProps),
  withNotOnProduction,
);
export default composedWrapper;
