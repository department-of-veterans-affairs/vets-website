import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * MyHealthAccessGuard component that will redirect the user to the my-health page if they do not have an MHV account
 *
 * @param {Object} children The children to render
 * @returns {Node} The children to render if the user is authenticated
 */

export const MyHealthAccessGuard = ({ children }) => {
  const hasMHVAccountState = state => {
    return ['OK', 'MULTIPLE'].includes(state?.user?.profile?.mhvAccountState);
  };
  if (!hasMHVAccountState) {
    return <Redirect to="/my-health" />;
  }
  return children;
};

MyHealthAccessGuard.propTypes = {
  children: PropTypes.node.isRequired,
};
