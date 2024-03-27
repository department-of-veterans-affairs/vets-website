import React from 'react';
import { Redirect } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
// import { isLOA1 } from '~/platform/user/selectors';
// import { hasHealthData } from '~/applications/mhv-landing-page/selectors';

/**
 * MyHealthAccessGuard component that will redirect the user to the my-health page if they are LOA1 or are not registerd with My HealtheVet
 *
 * @param {Object} children The children to render
 * @returns {Node} The children to render if the user is authenticated
 */

export const MyHealthAccessGuard = ({ children }) => {
  // const isUnverified = useSelector(isLOA1);
  // const userHasHealthData = useSelector(hasHealthData);
  const hasMHVAccountState = state => {
    return ['OK', 'MULTIPLE'].includes(state?.user?.profile?.mhvAccountState);
  };
  if (hasMHVAccountState) {
    return <Redirect to="/my-health" />;
  }
  return children;
};

MyHealthAccessGuard.propTypes = {
  children: PropTypes.node.isRequired,
};
