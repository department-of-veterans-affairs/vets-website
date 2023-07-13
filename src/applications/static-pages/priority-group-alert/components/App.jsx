import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import PriorityGroup from './PriorityGroup';
import SignInPrompt from './SignInPrompt';

const App = ({ isSignedIn }) => {
  return isSignedIn ? <PriorityGroup /> : <SignInPrompt />;
};

App.propTypes = {
  isSignedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  isSignedIn: isLoggedIn(state),
});

export default connect(
  mapStateToProps,
  null,
)(App);
