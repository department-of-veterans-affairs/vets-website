import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import { generateCoe } from '../../shared/actions';
import formConfig from '../config/form';

function App(props) {
  const { children, getCoe, location } = props;

  useEffect(
    () => {
      getCoe();
    },
    [getCoe],
  );

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => ({
  certificateOfEligibility: state.certificateOfEligibility,
});

const mapDispatchToProps = {
  getCoe: generateCoe,
};

App.propTypes = {
  children: PropTypes.node.isRequired,
  getCoe: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export { App };
