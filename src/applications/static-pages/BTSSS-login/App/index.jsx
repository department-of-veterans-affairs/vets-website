// Node modules.
import React, { useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isLoggedIn } from 'platform/user/selectors';
// import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';
import { makeSelectFeatureToggles } from '../selectors';

import AuthContext from '../AuthContext';
import UnauthContext from '../UnauthContext';

export const App = ({ currentlyLoggedIn }) => {
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  let { BTSSSLoginWidget } = useSelector(selectFeatureToggles);

  BTSSSLoginWidget = true;

  if (BTSSSLoginWidget) {
    if (currentlyLoggedIn) {
      return <AuthContext />;
    }
    return <UnauthContext />;
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
