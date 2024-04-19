import { useSelector } from 'react-redux';

/**
 * Route guard hook that will redirect the user to the /my-health landing page if the user does not have an MHV account
 * @returns {null}
 */
export const useMyHealthAccessGuard = () => {
  const mhvAccountState = useSelector(
    state => state?.user?.profile?.mhvAccountState,
  );

  if (mhvAccountState !== 'NONE') {
    window.history.replaceState({}, '', '/my-health/');
    window.location.reload();
    return null;
  }

  return null;
};
