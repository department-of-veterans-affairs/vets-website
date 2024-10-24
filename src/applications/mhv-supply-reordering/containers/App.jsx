import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { fetchMdotData } from '../actions';

/**
 * Root container for the form application.
 * @param {Object} location form location
 * @param {*} children children for the form
 * @param {function} fetchMdotFunc function to fetch the MDOT data
 */
const App = ({ location, children, fetchMdotFunc }) => {
  useEffect(
    () => {
      fetchMdotFunc();
    },
    [fetchMdotFunc],
  );

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
};

App.propTypes = {
  fetchMdotFunc: PropTypes.func.isRequired,
  children: PropTypes.any,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
};

const mapDispatchToProps = dispatch => ({
  fetchMdotFunc: () => dispatch(fetchMdotData()),
});

export default connect(
  null,
  mapDispatchToProps,
)(App);
