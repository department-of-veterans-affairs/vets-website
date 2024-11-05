import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { signInServiceEnabled } from '~/platform/user/authentication/selectors';
import RoutedSavableApp from '~/platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { fetchMdotData } from '../actions';

/**
 * Root container for the form application.
 * @param {Object} location form location
 * @param {*} children children for the form
 * @param {function} fetchMdotFunc function to fetch the MDOT data
 * @param {*} user the user information
 */
const App = ({ location, children, fetchMdotFunc, user }) => {
  const useSiS = useSelector(signInServiceEnabled);

  useEffect(
    () => {
      fetchMdotFunc();
    },
    [fetchMdotFunc],
  );

  return (
    <RequiredLoginView
      useSiS={useSiS}
      user={user}
      serviceRequired={[backendServices.USER_PROFILE]}
    >
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </RequiredLoginView>
  );
};

App.propTypes = {
  fetchMdotFunc: PropTypes.func.isRequired,
  children: PropTypes.any,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  fetchMdotFunc: () => dispatch(fetchMdotData()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
