import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

/**
 * MyHealthAccessGuard component that will redirect the user to the my-health page if they do not have an MHV account
 *
 * @param {Object} children The children to render
 * @returns {Object} The children to render if the user is authenticated
 */
export const MyHealthAccessGuard = ({ children }) => {
  const mhvAccountState = useSelector(
    state => state?.user?.profile?.mhvAccountState,
  );

  if (mhvAccountState === 'NONE') {
    return <Redirect to="/my-health" />;
  }

  return children;
};

MyHealthAccessGuard.propTypes = {
  children: PropTypes.node.isRequired,
};
