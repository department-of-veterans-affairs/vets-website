// Node modules.
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isLoggedIn } from 'platform/user/selectors';
import AuthContext from '../AuthContext';
import UnauthContext from '../UnauthContext';

export const App = ({ currentlyLoggedIn, BTSSSLoginWidget }) => {
  if (BTSSSLoginWidget) {
    return currentlyLoggedIn ? <AuthContext /> : <UnauthContext />;
  }
  return <></>;
};

const mapStateToProps = state => ({
  currentlyLoggedIn: isLoggedIn(state),
  BTSSSLoginWidget: state?.featureToggles?.BTSSSLoginWidget,
});

export default connect(
  mapStateToProps,
  null,
)(App);

App.propTypes = {
  BTSSSLoginWidget: PropTypes.bool,
  currentlyLoggedIn: PropTypes.bool,
};
