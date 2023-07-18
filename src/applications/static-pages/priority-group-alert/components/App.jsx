import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { AUTH_EVENTS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import Error from './Error';
import Loading from './Loading';
import PriorityGroup from './PriorityGroup';
import SignInPrompt from './SignInPrompt';
import { fetchEnrollmentStatus } from '../actions';

export const App = ({
  enrollmentStatus,
  error,
  handleSignInClick,
  isSignedIn,
  loading,
}) => {
  useEffect(() => fetchEnrollmentStatus(), []);
  const showSignInPrompt = !error && !loading && !isSignedIn;
  const showPriorityGroup = !error && !loading && isSignedIn;
  const showLoadingIndicator = !error && loading;

  return (
    <>
      {showSignInPrompt && (
        <SignInPrompt handleSignInClick={handleSignInClick} />
      )}
      {showPriorityGroup && <PriorityGroup {...enrollmentStatus} />}
      {showLoadingIndicator && <Loading />}
      {error && <Error />}
    </>
  );
};

App.propTypes = {
  enrollmentStatus: PropTypes.shape({
    effectiveDate: PropTypes.string,
    priorityGroup: PropTypes.string,
  }),
  error: PropTypes.bool,
  handleSignInClick: PropTypes.func,
  isSignedIn: PropTypes.bool,
  loading: PropTypes.bool,
};

const mapStateToProps = state => ({
  isSignedIn: isLoggedIn(state),
  loading: state.loading,
  enrollmentStatus: state.payload,
  error: state.error,
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
