import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

/**
 * MyHealthAccessGuard component that will redirect the user to the my-health page if they do not have an MHV account
 *
 * @param {Object} children The children to render
 * @returns {Node} The children to render if the user is authenticated
 */
export const MyHealthAccessGuard = ({ children }) => {
  const hasMHVAccount = useSelector(state => {
    const mhvAccountState = state?.user?.profile?.mhvAccountState;
    return ['OK', 'MULTIPLE'].includes(mhvAccountState);
  });

  if (!hasMHVAccount) {
    return <Redirect to="/my-health" />;
  }

  return children;
};

MyHealthAccessGuard.propTypes = {
  children: PropTypes.node.isRequired,
};
