import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { teardownProfileSession } from 'platform/user/profile/utilities';
import { updateLoggedInStatus } from 'platform/user/authentication/actions';

import { useLocalStorage } from './useLocalStorage';

export const useMockedLogin = () => {
  const [
    localHasSession,
    setLocalHasSession,
    clearLocalHasSession,
  ] = useLocalStorage('hasSession', '');

  const loggedInFromState = useSelector(
    state => state?.user?.login?.currentlyLoggedIn,
  );

  const loggedIn = useMemo(
    () => localHasSession === 'true' || loggedInFromState,
    [localHasSession, loggedInFromState],
  );

  const dispatch = useDispatch();

  const logIn = () => {
    setLocalHasSession('true');
    dispatch(updateLoggedInStatus(true));
  };

  const logOut = () => {
    teardownProfileSession();
    dispatch(updateLoggedInStatus(false));
    clearLocalHasSession();
  };

  const useLoggedInQuery = location => {
    useEffect(
      () => {
        if (location?.query?.loggedIn === 'true') {
          setLocalHasSession('true');
          dispatch(updateLoggedInStatus(true));
        }

        if (location?.query?.loggedIn === 'false') {
          teardownProfileSession();
          dispatch(updateLoggedInStatus(false));
          clearLocalHasSession();
        }

        // having the pollTimeout present triggers some api calls to be made locally and in codespaces
        if (!window?.VetsGov?.pollTimeout) {
          window.VetsGov.pollTimeout = 500;
        }
      },
      [location],
    );
  };

  return { logIn, logOut, useLoggedInQuery, loggedIn };
};
