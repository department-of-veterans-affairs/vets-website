/* eslint-disable no-console */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

export const useMyHealthAccessGuard = () => {
  const history = useHistory();
  const mhvAccountState = useSelector(
    state => state?.user?.profile?.mhvAccountState,
  );

  useEffect(
    () => {
      if (mhvAccountState === 'NONE') {
        console.log('Redirecting to /my-health');
        if (
          !window.location.pathname.startsWith('/my-health/') ||
          window.location.pathname.length > '/my-health/'.length
        ) {
          history.replace('/my-health');
        }
      } else {
        console.log('Access granted to current path');
      }
    },
    [mhvAccountState, history],
  );

  return null;
};
