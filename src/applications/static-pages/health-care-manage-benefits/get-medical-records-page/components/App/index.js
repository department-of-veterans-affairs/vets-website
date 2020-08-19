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

export const App = ({ isCernerPatient, showNewGetMedicalRecordsPage }) => {
  // Show legacy content if Cerner isn't live or if we explicitly shouldn't show the page via a feature flag.
  if (!isCernerLive || showNewGetMedicalRecordsPage === false) {
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
    state?.featureToggles?.showNewGetMedicalRecordsPage,
});

export default connect(
  mapStateToProps,
  null,
)(App);
