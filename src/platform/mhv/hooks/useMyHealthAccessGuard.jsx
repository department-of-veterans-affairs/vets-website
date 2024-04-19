/* eslint-disable no-console */
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

/**
 * Route guard hook that will redirect the user to the /my-health landing page if mhvAccountState is 'NONE'
 * @returns {JSX.Element|null}
 */

export const useMyHealthAccessGuard = () => {
  const mhvAccountState = useSelector(
    state => state?.user?.profile?.mhvAccountState,
  );

  if (mhvAccountState === 'NONE') {
    console.log('Redirecting to /my-health');
    return <Redirect to="/my-health" />;
  }
  console.log('Not redirecting to /my-health');

  return null;
};
