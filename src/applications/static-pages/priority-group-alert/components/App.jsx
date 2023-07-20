import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring';
import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { AUTH_EVENTS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities';
import ApiError from './ApiError';
import Loading from './Loading';
import PactAct from './PactAct';
import PriorityGroup from './PriorityGroup';
import SignInPrompt from './SignInPrompt';
import { fetchEnrollmentStatus as actualFetchEnrollmentStatus } from '../actions';
import UnknownGroup from './UnknownGroup';

export const App = ({
  enabled,
  enrollmentStatus,
  error,
  fetchEnrollmentStatus = actualFetchEnrollmentStatus,
  handleSignInClick,
  isSignedIn,
  loading,
}) => {
  useEffect(() => (enabled && isSignedIn ? fetchEnrollmentStatus() : null), [
    enabled,
    isSignedIn,
  ]);
  const showSignInPrompt = enabled && !error && !loading && !isSignedIn;
  const showLoadingIndicator = enabled && !error && loading;
  const showUnknownGroup =
    enabled && !error && !loading && !enrollmentStatus?.priorityGroup;
  const showPriorityGroup =
    enabled &&
    !error &&
    !loading &&
    isSignedIn &&
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
  isSignedIn: PropTypes.bool,
  loading: PropTypes.bool,
};

App.defaultProps = {
  enabled: false,
  isSignedIn: false,
};

const mapStateToProps = state => ({
  enabled: toggleValues(state)[FEATURE_FLAG_NAMES.showPriorityGroupAlertWidget],
  enrollmentStatus: state.data,
  error: state.error,
  isSignedIn: isLoggedIn(state),
  loading: state.loading,
});

const mapDispatchToProps = dispatch => ({
  handleSignInClick: () => {
    recordEvent({ event: AUTH_EVENTS.LOGIN });
    dispatch(toggleLoginModal(true));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
