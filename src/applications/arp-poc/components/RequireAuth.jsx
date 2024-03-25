import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom-v5-compat';
import { useSelector } from 'react-redux';

import { selectUser } from '../selectors/user';

export default function RequireAuth({ children }) {
  const { isLoading, profile } = useSelector(selectUser);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <Navigate to="/" />;
  }

  // `children` and `Outlet` make this component usable as a `Route` element or
  // as a normal React component.
  if (children) {
    return children;
  }

  return <Outlet />;
}

RequireAuth.propTypes = {
  children: PropTypes.object,
};
