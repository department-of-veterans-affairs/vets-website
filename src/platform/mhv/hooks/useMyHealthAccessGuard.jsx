import { useSelector } from 'react-redux';

/**
 * Route guard hook that will redirect the user to the /my-health landing page if user does not have an MHV account.
 */

export const useMyHealthAccessGuard = () => {
  const mhvAccountState = useSelector(
    state => state?.user?.profile?.mhvAccountState,
  );

  if (mhvAccountState === 'NONE') {
    return window.location.replace('/my-health');
  }

  return null;
};
