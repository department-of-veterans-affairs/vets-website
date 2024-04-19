import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

/**
 * Route guard hook that will redirect the user to the /my-health landing page if the user does not have an MHV account
 * @returns {JSX.Element|null}
 */

export const useMyHealthAccessGuard = () => {
  const mhvAccountState = useSelector(
    state => state?.user?.profile?.mhvAccountState,
  );

  if (mhvAccountState === 'NONE') {
    return (
      <Redirect
        to={{
          pathname: '/my-health/',
          state: { from: window.location.pathname },
        }}
      />
    );
  }

  return null;
};
