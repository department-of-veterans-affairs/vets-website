// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
// Relative imports.
import AuthContent from '../AuthContent';
import UnauthContent from '../UnauthContent';
import { selectPatientFacilities } from 'platform/user/selectors';
import { isAuthenticatedWithSSOe } from 'platform/user/authentication/selectors';

export const App = ({ authenticatedWithSSOe, facilities }) => {
  const cernerFacilities = facilities?.filter(f => f.usesCernerTestResults);
  const otherFacilities = facilities?.filter(f => !f.usesCernerTestResults);
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
  facilities: selectPatientFacilities(state),
});

export default connect(
  mapStateToProps,
  null,
)(App);
