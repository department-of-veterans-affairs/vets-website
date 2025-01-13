// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isAuthenticatedWithSSOe } from '@department-of-veterans-affairs/platform-user/authentication/selectors';
import { isLOA3 } from '@department-of-veterans-affairs/platform-user/selectors';
// Relative imports.
import AuthContent from '../AuthContent';
import UnauthContent from '../UnauthContent';
import {
  authenticatedWithSSOePropType,
  useSingleLogoutPropType,
} from '../../../propTypes';

export const App = ({
  authenticatedWithSSOe = false,
  hasLOA3 = false,
  useSingleLogout,
  widgetType,
}) => {
  if (authenticatedWithSSOe && hasLOA3) {
    return (
      <AuthContent useSingleLogout={useSingleLogout} widgetType={widgetType} />
    );
  }

  return <UnauthContent />;
};

App.propTypes = {
  widgetType: PropTypes.string.isRequired,
  authenticatedWithSSOe: authenticatedWithSSOePropType,
  hasLOA3: PropTypes.bool,
  useSingleLogout: useSingleLogoutPropType,
};

const mapStateToProps = state => ({
  authenticatedWithSSOe: isAuthenticatedWithSSOe(state) || false,
  hasLOA3: isLOA3(state),
  useSingleLogout: state?.featureToggles?.pwEhrCtaUseSlo,
});

const connectedApp = connect(
  mapStateToProps,
  null,
)(App);
connectedApp.displayName = 'ScheduleAppointmentsWidget';

export default connectedApp;
