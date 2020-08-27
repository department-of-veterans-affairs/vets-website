// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { hasSession } from 'platform/user/profile/utilities';
// Relative imports.
// import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';

export const App = ({ authenticated }) => {
  if (!authenticated) {
    console.log('I am not authenticated');
    return null;
  }

  console.log('I am authenticated');
  // document.getElementById('homepage').style.display = 'none';
  return <div>This authenticated homepage extreme!</div>;
};

App.propTypes = {
  authenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  authenticated: true,
});

export default connect(
  mapStateToProps,
  null,
)(App);
