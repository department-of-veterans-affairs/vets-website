import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import PriorityGroup from './PriorityGroup';
import SignInPrompt from './SignInPrompt';

export const App = ({ isSignedIn }) => {
  if (!isSignedIn) {
    return <SignInPrompt />;
  }

  return <PriorityGroup value="8B" updatedAt="2023/07/13" />;
};

App.propTypes = {
  isSignedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  isSignedIn: isLoggedIn(state),
});

export default connect(mapStateToProps)(App);
