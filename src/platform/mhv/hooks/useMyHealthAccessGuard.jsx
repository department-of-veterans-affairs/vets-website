import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useMyHealthAccessGuard = () => {
  const mhvAccountState = useSelector(
    state => state?.user?.profile?.mhvAccountState,
  );

  useEffect(
    () => {
      if (mhvAccountState !== 'NONE') {
        const currentPath = window.location.pathname;
        // Check if the path starts with '/my-health/' and has more characters beyond '/my-health/'
        if (
          currentPath.startsWith('/my-health/') &&
          currentPath !== '/my-health'
        ) {
          window.location.replace('/my-health');
        }
      }
    },
    [mhvAccountState],
  );

  return null;
};
