import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { isLoggedIn } from 'platform/user/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import ApiError from './ApiError';
import Loading from './Loading';
import PactAct from './PactAct';
import PriorityGroup from './PriorityGroup';
import SignInPrompt from './SignInPrompt';
import {
  fetchEnrollmentStatus as fetchEnrollmentStatusFn,
  handleSignInClick as handleSignInClickFn,
} from '../actions';
import UnknownGroup from './UnknownGroup';

export const App = ({
  enabled,
  enrollmentStatus,
  error,
  fetchEnrollmentStatus,
  handleSignInClick,
  loading,
  signedIn,
}) => {
  // useEffect(() => (enabled && signedIn ? fetchEnrollmentStatus() : null), [
  //   enabled,
  //   signedIn,
  // ]);

  useEffect(() => fetchEnrollmentStatus(), [
    enabled,
    fetchEnrollmentStatus,
    signedIn,
  ]);
  const showSignInPrompt = enabled && !error && !loading && !signedIn;
  const showLoadingIndicator = enabled && !error && loading && signedIn;
  const showUnknownGroup =
    enabled &&
    !error &&
    !loading &&
    signedIn &&
    !enrollmentStatus?.priorityGroup;
  const showPriorityGroup =
    enabled &&
    !error &&
    !loading &&
    signedIn &&
    !!enrollmentStatus?.priorityGroup;

  return (
    <>
      {!enabled && <PactAct />}
      {showSignInPrompt && (
        <SignInPrompt handleSignInClick={handleSignInClick} />
      )}
      {showUnknownGroup && <UnknownGroup />}
      {showPriorityGroup && <PriorityGroup {...enrollmentStatus} />}
      {showLoadingIndicator && <Loading />}
      {error && <ApiError />}
    </>
  );
};

App.propTypes = {
  enabled: PropTypes.bool,
  enrollmentStatus: PropTypes.shape({
    effectiveDate: PropTypes.string,
    priorityGroup: PropTypes.string,
  }),
  error: PropTypes.bool,
  fetchEnrollmentStatus: PropTypes.func,
  handleSignInClick: PropTypes.func,
  loading: PropTypes.bool,
  signedIn: PropTypes.bool,
};

App.defaultProps = {
  enabled: false,
  fetchEnrollmentStatus: () => {},
  handleSignInClick: () => {},
  signedIn: false,
};

const mapStateToProps = state => ({
  enabled: toggleValues(state)[FEATURE_FLAG_NAMES.showPriorityGroupAlertWidget],
  enrollmentStatus: state.data,
  error: state.error,
  loading: state.loading,
  signedIn: isLoggedIn(state),
});

const mapDispatchToProps = {
  handleSignInClick: handleSignInClickFn,
  fetchEnrollmentStatus: fetchEnrollmentStatusFn,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
