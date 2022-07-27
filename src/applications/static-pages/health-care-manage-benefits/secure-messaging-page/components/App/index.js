// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
// Relative imports.
import { selectPatientFacilities } from 'platform/user/selectors';
import { selectPatientFacilities as selectPatientFacilitiesDsot } from 'platform/user/cerner-dsot/selectors';
import { isAuthenticatedWithSSOe } from 'platform/user/authentication/selectors';
import AuthContent from '../AuthContent';
import UnauthContent from '../UnauthContent';

export const App = ({ authenticatedWithSSOe, facilities }) => {
  const cernerFacilities = facilities?.filter(f => f.usesCernerMessaging);
  const otherFacilities = facilities?.filter(f => !f.usesCernerMessaging);
  if (!isEmpty(cernerFacilities)) {
    return (
      <AuthContent
        cernerFacilities={cernerFacilities}
        otherFacilities={otherFacilities}
        authenticatedWithSSOe={authenticatedWithSSOe}
      />
    );
  }

  return <UnauthContent />;
};

App.propTypes = {
  // From mapStateToProps.
  authenticatedWithSSOe: PropTypes.bool,
  facilities: PropTypes.arrayOf(
    PropTypes.shape({
      facilityId: PropTypes.string.isRequired,
      isCerner: PropTypes.bool.isRequired,
      usesCernerAppointments: PropTypes.bool,
      usesCernerMedicalRecords: PropTypes.bool,
      usesCernerMessaging: PropTypes.bool,
      usesCernerRx: PropTypes.bool,
      usesCernerTestResults: PropTypes.bool,
    }).isRequired,
  ),
};

const mapStateToProps = state => ({
  authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
  facilities: state?.featureToggles?.pwEhrCtaDrupalSourceOfTruth
    ? selectPatientFacilitiesDsot(state)
    : selectPatientFacilities(state),
});

export default connect(
  mapStateToProps,
  null,
)(App);
