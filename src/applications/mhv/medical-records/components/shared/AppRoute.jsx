import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import App from '../../containers/App';

/**
 * Route that wraps its children within the application component.
 */
const AppRoute = ({ children, ...rest }) => {
  return (
    <Route {...rest}>
      <App>{children}</App>
    </Route>
  );
};

AppRoute.propTypes = {
  children: PropTypes.object,
};
