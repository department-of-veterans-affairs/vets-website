import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isLOA1 } from '~/platform/user/selectors';

export const AuthGuard = ({ children }) => {
  const isUnverified = useSelector(isLOA1);
  if (isUnverified) {
    return <Redirect to="/my-health" />;
  }
  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
};
