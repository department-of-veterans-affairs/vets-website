// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import AuthContent from '../AuthContent';
import LegacyContent from '../LegacyContent';
import UnauthContent from '../UnauthContent';
import { isCernerLive } from 'platform/utilities/cerner';
import { selectIsCernerPatient } from 'platform/user/selectors';

export const App = ({ isCernerPatient }) => {
  if (!isCernerLive) {
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
