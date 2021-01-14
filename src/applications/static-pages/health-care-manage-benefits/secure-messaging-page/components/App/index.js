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
import { isAuthenticatedWithSSOe } from 'platform/user/authentication/selectors';

export const App = ({
  facilities,
  showNewSecureMessagingPage,
  authenticatedWithSSOe,
}) => {
  if (!showNewSecureMessagingPage) {
    return <LegacyContent />;
  }

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
  showNewSecureMessagingPage: PropTypes.bool,
};

const mapStateToProps = state => ({
  facilities: selectPatientFacilities(state),
  authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
  showNewSecureMessagingPage:
    state?.featureToggles?.[featureFlagNames.showNewSecureMessagingPage],
});

export default connect(
  mapStateToProps,
  null,
)(App);
