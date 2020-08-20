// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import AuthContent from '../AuthContent';
import LegacyContent from '../LegacyContent';
import UnauthContent from '../UnauthContent';
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';
import { selectIsCernerPatient } from 'platform/user/selectors';

export const App = ({ isCernerPatient, showNewGetMedicalRecordsPage }) => {
  if (!showNewGetMedicalRecordsPage) {
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
  showNewGetMedicalRecordsPage: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isCernerPatient: selectIsCernerPatient(state),
  showNewGetMedicalRecordsPage:
    state?.featureToggles?.[featureFlagNames.showNewGetMedicalRecordsPage],
});

export default connect(
  mapStateToProps,
  null,
)(App);
