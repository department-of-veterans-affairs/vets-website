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
import { hasFacilityException } from '../../../utils';

export const App = ({
  facilityIDs,
  isCernerPatient,
  showAuthFacilityIDExceptions,
  showNewViewTestLabResultsPage,
}) => {
  if (!showNewViewTestLabResultsPage) {
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
  showNewViewTestLabResultsPage: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  facilityIDs: selectFacilityIDs(state),
  isCernerPatient: selectIsCernerPatient(state),
  showNewViewTestLabResultsPage:
    state?.featureToggles?.[featureFlagNames.showNewViewTestLabResultsPage],
});

export default connect(
  mapStateToProps,
  null,
)(App);
