// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import AuthContent from '../AuthContent';
import LegacyContent from '../LegacyContent';
import UnauthContent from '../UnauthContent';
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';
import { hasFacilityException } from '../../../utils';
import {
  selectFacilityIDs,
  selectIsCernerPatient,
} from 'platform/user/selectors';

export const App = ({
  facilityIDs,
  isCernerPatient,
  showAuthFacilityIDExceptions,
  showNewGetMedicalRecordsPage,
}) => {
  if (!showNewGetMedicalRecordsPage) {
    return <LegacyContent />;
  }

  if (isCernerPatient) {
    return <AuthContent />;
  }

  if (hasFacilityException(facilityIDs, showAuthFacilityIDExceptions)) {
    return <AuthContent />;
  }

  return <UnauthContent />;
};

App.propTypes = {
  showAuthFacilityIDExceptions: PropTypes.arrayOf(PropTypes.string.isRequired)
    .isRequired,
  // From mapStateToProps.
  facilityIDs: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  isCernerPatient: PropTypes.bool,
  showNewGetMedicalRecordsPage: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  facilityIDs: selectFacilityIDs(state),
  isCernerPatient: selectIsCernerPatient(state),
  showNewGetMedicalRecordsPage:
    state?.featureToggles?.[featureFlagNames.showNewGetMedicalRecordsPage],
});

export default connect(
  mapStateToProps,
  null,
)(App);
