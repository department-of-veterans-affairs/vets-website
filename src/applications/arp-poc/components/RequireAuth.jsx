import React from 'react';
import { Navigate, Outlet } from 'react-router-dom-v5-compat';
import { useSelector } from 'react-redux';

import { selectUser } from '../selectors/user';

export default function RequireAuth({ children }) {
  const user = useSelector(selectUser);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (children) {
    return children;
  }

  return <Outlet />;
}
