// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
// Relative imports.
import AuthContent from '../AuthContent';
import LegacyContent from '../LegacyContent';
import UnauthContent from '../UnauthContent';
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';
import { selectPatientFacilities } from 'platform/user/selectors';

export const App = ({ facilities, showNewViewTestLabResultsPage }) => {
  if (!showNewViewTestLabResultsPage) {
    return <LegacyContent />;
  }

  const cernerFacilities = facilities?.filter(f => f.usesCernerTestResults);
  const otherFacilities = facilities?.filter(f => !f.usesCernerTestResults);
  if (!isEmpty(cernerFacilities)) {
    return (
      <AuthContent
        cernerFacilities={cernerFacilities}
        otherFacilities={otherFacilities}
      />
    );
  }

  return <UnauthContent />;
};

App.propTypes = {
  // From mapStateToProps.
  facilities: PropTypes.arrayOf(
    PropTypes.shape({
      facilityId: PropTypes.string.isRequired,
      isCerner: PropTypes.bool.isRequired,
      usesCernerAppointments: PropTypes.string,
      usesCernerMedicalRecords: PropTypes.string,
      usesCernerMessaging: PropTypes.string,
      usesCernerRx: PropTypes.string,
      usesCernerTestResults: PropTypes.string,
    }).isRequired,
  ),
  showNewViewTestLabResultsPage: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  facilities: selectPatientFacilities(state),
  showNewViewTestLabResultsPage:
    state?.featureToggles?.[featureFlagNames.showNewViewTestLabResultsPage],
});

export default connect(
  mapStateToProps,
  null,
)(App);
