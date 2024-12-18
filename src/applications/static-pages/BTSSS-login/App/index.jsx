// Node modules.
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isLoggedIn } from 'platform/user/selectors';

import AuthContext from '../AuthContext';
import UnauthContext from '../UnauthContext';

export const App = ({ currentlyLoggedIn }) => {
  return (
    <>
      <p>
        You can file a claim online through the Beneficiary Travel Self Service
        System (BTSSS).
      </p>
      {currentlyLoggedIn ? <AuthContext /> : <UnauthContext />}
    </>
  );
};

const mapStateToProps = state => {
  return {
    currentlyLoggedIn: isLoggedIn(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(App);

App.propTypes = {
  currentlyLoggedIn: PropTypes.bool,
};
