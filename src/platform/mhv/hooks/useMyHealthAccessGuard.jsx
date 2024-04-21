import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const useMyHealthAccessGuard = () => {
  const mhvAccountState = useSelector(
    state => state?.user?.profile?.mhvAccountState,
  );

  if (mhvAccountState === 'NONE') {
    return <Redirect to="/my-health" push />;
  }

  return null;
};
