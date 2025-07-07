import React from 'react';
import PropTypes from 'prop-types';
import SmBreadcrumbs from './SmBreadcrumbs';

const RouteWithBreadcrumbs = ({ component: Component, ...props }) => {
  return (
    <>
      <SmBreadcrumbs />
      <Component {...props} />
    </>
  );
};

RouteWithBreadcrumbs.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default RouteWithBreadcrumbs;
