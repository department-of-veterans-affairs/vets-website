// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hasSession } from 'platform/user/profile/utilities';
// Relative imports.
// import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';

export const App = ({ authenticated }) => {
  if (!authenticated) {
    return null;
  }

  document.getElementById('homepage').style.display = 'none';
  return <div>This is authenticated homepage extreme!</div>;
};

App.propTypes = {
  authenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  authenticated: state.user.login.currentlyLoggedIn,
});

export default connect(
  mapStateToProps,
  null,
)(App);
