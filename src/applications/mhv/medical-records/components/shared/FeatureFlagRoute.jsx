import React from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const FeatureFlagRoute = ({ featureFlag, children, ...rest }) => {
  const displayRoute = useSelector(state => state.featureToggles[featureFlag]);
  return displayRoute ? <Route {...rest}>{children}</Route> : null;
};

export default FeatureFlagRoute;

FeatureFlagRoute.propTypes = {
  children: PropTypes.object,
  featureFlag: PropTypes.string,
};
