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

export const App = ({ facilities, showNewRefillTrackPrescriptionsPage }) => {
  if (!showNewRefillTrackPrescriptionsPage) {
    return <LegacyContent />;
  }

  const cernerFacilities = facilities?.filter(f => f.usesCernerRx);
  const otherFacilities = facilities?.filter(f => !f.usesCernerRx);
  if (isEmpty(cernerFacilities)) {
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
      usesCernerAppointments: PropTypes.string.isRequired,
      usesCernerMedicalRecords: PropTypes.string.isRequired,
      usesCernerMessaging: PropTypes.string.isRequired,
      usesCernerRx: PropTypes.string.isRequired,
      usesCernerTestResults: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  showNewRefillTrackPrescriptionsPage: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  facilities: selectPatientFacilities(state),
  showNewRefillTrackPrescriptionsPage:
    state?.featureToggles?.[
      featureFlagNames.showNewRefillTrackPrescriptionsPage
    ],
});

export default connect(
  mapStateToProps,
  null,
)(App);
