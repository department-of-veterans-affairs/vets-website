// Node modules.
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isLoggedIn } from 'platform/user/selectors';
import AuthContext from '../AuthContext';
import UnauthContext from '../UnauthContext';
import { selectFeatureToggle } from '../selectors';

export const App = ({ currentlyLoggedIn, showBtsssLoginWidget }) => {
  if (showBtsssLoginWidget) {
    return currentlyLoggedIn ? <AuthContext /> : <UnauthContext />;
  }
  return <></>;
};

const mapStateToProps = state => {
  return {
    currentlyLoggedIn: isLoggedIn(state),
    showBtsssLoginWidget: selectFeatureToggle(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(App);

App.propTypes = {
  showBtsssLoginWidget: PropTypes.bool,
  currentlyLoggedIn: PropTypes.bool,
};
