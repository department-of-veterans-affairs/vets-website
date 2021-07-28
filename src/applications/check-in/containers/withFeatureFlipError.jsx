import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { checkInExperienceEnabled, loadingFeatureFlags } from '../selectors';

const withFeatureFlipError = WrappedComponent => props => {
  const { isCheckInEnabled, isLoadingFeatureFlags } = props;
  const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayErrorMessage(true);
    }, 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (isLoadingFeatureFlags) {
    return (
      <>
        <LoadingIndicator message="Loading your check in experience" />
      </>
    );
  } else if (!isCheckInEnabled) {
    window.location.replace('/');
    return <></>;
  } else if (displayErrorMessage) {
    return <>Whomp</>;
  } else {
    return (
      <>
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
  withFeatureFlipError,
);
export default composedWrapper;
