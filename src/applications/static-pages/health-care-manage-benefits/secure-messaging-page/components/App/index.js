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

export const App = ({ isCernerPatient, showNewSecureMessagingPage }) => {
  // Show legacy content if Cerner isn't live or if we explicitly shouldn't show the page via a feature flag.
  if (!isCernerLive || showNewSecureMessagingPage === false) {
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
  showNewSecureMessagingPage: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isCernerPatient: selectIsCernerPatient(state),
  showNewSecureMessagingPage: state?.featureToggles?.showNewSecureMessagingPage,
});

export default connect(
  mapStateToProps,
  null,
)(App);
