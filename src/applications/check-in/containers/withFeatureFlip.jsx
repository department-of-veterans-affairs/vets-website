import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { checkInExperienceEnabled, loadingFeatureFlags } from '../selectors';

const withFeatureFlip = WrappedComponent => props => {
  const { isCheckInEnabled, isLoadingFeatureFlags } = props;
  if (isLoadingFeatureFlags) {
    return (
      <>
        <LoadingIndicator message="Loading your check in experience" />
      </>
    );
  } else if (!isCheckInEnabled) {
    window.location.replace('/');
    return <></>;
  } else {
    return (
      <>
        <meta name="robots" content="noindex" />
        <WrappedComponent {...props} />
      </>
    );
  }
};
const mapStateToProps = state => ({
  isCheckInEnabled: checkInExperienceEnabled(state),
  isLoadingFeatureFlags: loadingFeatureFlags(state),
});

const composedWrapper = compose(
  connect(mapStateToProps),
  withFeatureFlip,
);
export default composedWrapper;
