// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import Header from '../Header';
import LegacyHeader from '../LegacyHeader';

export const App = ({ showHeaderV2 }) => {
  // Render the legacy header if the feature toggle is not enabled.
  if (!showHeaderV2) {
    return <LegacyHeader />;
  }

  return <Header />;
};

App.propTypes = {
  // From mapStateToProps.
  showHeaderV2: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  showHeaderV2: state?.featureToggles?.showHeaderV2,
});

export default connect(
  mapStateToProps,
  null,
)(App);
