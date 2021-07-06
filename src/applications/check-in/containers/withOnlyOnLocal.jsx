import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import environment from 'platform/utilities/environment';

import { checkInExperienceEnabled, loadingFeatureFlags } from '../selectors';

const withOnlyOnLocal = WrappedComponent => props => {
  if (!environment.isLocalhost()) {
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
  withOnlyOnLocal,
);
export default composedWrapper;
