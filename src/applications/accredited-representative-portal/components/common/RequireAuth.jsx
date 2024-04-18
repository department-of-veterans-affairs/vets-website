import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom-v5-compat';

import { selectUser } from '../../selectors/user';

const RequireAuth = ({ children }) => {
  const { isLoading, profile } = useSelector(selectUser);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <Navigate to="/" />;
  }

  if (children) {
    return children;
  }

  return <Outlet />;
};

RequireAuth.propTypes = {
  children: PropTypes.object,
};

export default RequireAuth;
