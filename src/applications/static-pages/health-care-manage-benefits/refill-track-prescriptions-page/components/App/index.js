// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import AuthContent from '../AuthContent';
import LegacyContent from '../LegacyContent';
import UnauthContent from '../UnauthContent';
import environment from 'platform/utilities/environment';
import { selectIsCernerPatient } from 'platform/user/selectors';

export const App = ({ isCernerPatient }) => {
  if (environment.isProduction()) {
    return <LegacyContent />;
  }

  if (isCernerPatient) {
    return <AuthContent />;
  }

  return <UnauthContent />;
};

App.propTypes = {
  // From mapStateToProps.
  isCernerPatient: PropTypes.bool,
};

const mapStateToProps = state => ({
  isCernerPatient: selectIsCernerPatient(state),
});

export default connect(
  mapStateToProps,
  null,
)(App);
