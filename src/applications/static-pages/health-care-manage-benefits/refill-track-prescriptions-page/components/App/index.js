// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import AuthContent from '../AuthContent';
import UnauthContent from '../UnauthContent';
import { selectIsCernerPatient } from 'platform/user/selectors';

export const App = ({ isCernerPatient }) => {
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
