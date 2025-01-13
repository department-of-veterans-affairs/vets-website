// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isAuthenticatedWithSSOe } from '@department-of-veterans-affairs/platform-user/authentication/selectors';
// Relative imports.
import AuthContent from '../AuthContent';
import UnauthContent from '../UnauthContent';
import {
  authenticatedWithSSOePropType,
  useSingleLogoutPropType,
} from '../../../propTypes';

export const App = ({ authenticatedWithSSOe, useSingleLogout, widgetType }) => {
  if (authenticatedWithSSOe) {
    return (
      <AuthContent useSingleLogout={useSingleLogout} widgetType={widgetType} />
    );
  }

  return <UnauthContent />;
};

App.propTypes = {
  widgetType: PropTypes.string.isRequired,
  authenticatedWithSSOe: authenticatedWithSSOePropType,
  useSingleLogout: useSingleLogoutPropType,
};

const mapStateToProps = state => ({
  authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
  useSingleLogout: state?.featureToggles?.pwEhrCtaUseSlo,
});

const connectedApp = connect(
  mapStateToProps,
  null,
)(App);
connectedApp.displayName = 'ScheduleAppointmentsWidget';

export default connectedApp;
