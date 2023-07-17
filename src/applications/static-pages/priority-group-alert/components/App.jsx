import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { AUTH_EVENTS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import PriorityGroup from './PriorityGroup';
import SignInPrompt from './SignInPrompt';

export const App = ({ handleSignInClick, isSignedIn }) => {
  if (!isSignedIn) {
    return <SignInPrompt handleSignInClick={handleSignInClick} />;
  }

  return <PriorityGroup value="8B" updatedAt="2023/07/13" />;
};

App.propTypes = {
  handleSignInClick: PropTypes.func,
  isSignedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  isSignedIn: isLoggedIn(state),
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
