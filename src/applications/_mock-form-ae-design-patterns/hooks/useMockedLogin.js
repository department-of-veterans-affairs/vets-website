import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { teardownProfileSession } from 'platform/user/profile/utilities';
import { updateLoggedInStatus } from 'platform/user/authentication/actions';
import { refreshProfile } from 'platform/user/exportsFile';
import { initializeProfile } from 'platform/user/profile/actions';

import { useLocalStorage } from './useLocalStorage';

// useMockedLogin is a hook that provides a way to log in and out of the application
// it also provides a way to check if the user is logged in
// used for local development
export const useMockedLogin = () => {
  const [
    localHasSession,
    setLocalHasSession,
    clearLocalHasSession,
  ] = useLocalStorage('hasSession', null);

  const loggedInFromState = useSelector(
    state => state?.user?.login?.currentlyLoggedIn,
  );

  /**
   * memoized value that is true if the local storage has a session or the redux store has a logged in status
   * @returns {boolean}
   */
  const loggedIn = useMemo(
    () => localHasSession === 'true' && loggedInFromState,
    [localHasSession, loggedInFromState],
  );

  const dispatch = useDispatch();

  const logIn = () => {
    setLocalHasSession('true');
    dispatch(updateLoggedInStatus(true));
    // get the profile right away, so that user state is updated in the redux store
    dispatch(refreshProfile());
  };

  const logOut = () => {
    teardownProfileSession();
    dispatch(updateLoggedInStatus(false));
    clearLocalHasSession();
  };

  /**
   * useLoggedInQuery is a hook that checks the url query params for loggedIn=true or loggedIn=false
   * and sets the local storage and redux store accordingly
   * @param {*} location - the location object from react router
   * @returns {void}
   */
  const useLoggedInQuery = location => {
    useEffect(
      () => {
        if (location?.query?.loggedIn === 'true') {
          setLocalHasSession('true');
          dispatch(initializeProfile());
        }

        if (location?.query?.loggedIn === 'false') {
          setTimeout(() => {
            teardownProfileSession();
            clearLocalHasSession();
            dispatch(updateLoggedInStatus(false));
          }, 500);
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
