// Node modules.
import React, { useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isLoggedIn } from 'platform/user/selectors';
import { makeSelectFeatureToggles } from '../selectors';

import AuthContext from '../AuthContext';
import UnauthContext from '../UnauthContext';

export const App = ({ currentlyLoggedIn }) => {
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { BTSSSLoginWidget } = useSelector(selectFeatureToggles);

  if (BTSSSLoginWidget) {
    return currentlyLoggedIn ? <AuthContext /> : <UnauthContext />;
  }
  return <></>;
};

const mapStateToProps = state => ({
  currentlyLoggedIn: isLoggedIn(state),
});

export default connect(
  mapStateToProps,
  null,
)(App);

App.propTypes = {
  currentlyLoggedIn: PropTypes.bool,
};
