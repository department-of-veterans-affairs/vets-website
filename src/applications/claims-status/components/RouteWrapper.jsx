import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const RouteWrapper = ({ component: Component, ...otherProps }) => {
  return (
    <Route
      {...otherProps}
      render={props => <Component {...props} {...otherProps} />}
    />
  );
};

RouteWrapper.propTypes = {
  component: PropTypes.func,
};

export default RouteWrapper;
