// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
// import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';

export const App = ({ authenticated }) => {
  if (!authenticated) {
    return null;
  }

  return <div>This authenticated homepage extreme!</div>;
};

App.propTypes = {
  // From mapStateToProps.
  authenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  authenticated: true,
});

export default connect(
  mapStateToProps,
  null,
)(App);
