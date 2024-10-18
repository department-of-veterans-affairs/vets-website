import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { teardownProfileSession } from 'platform/user/profile/utilities';
import { updateLoggedInStatus } from 'platform/user/authentication/actions';

import { useLocalStorage } from './useLocalStorage';

export const useMockedLogin = location => {
  const [, setHasSession] = useLocalStorage('hasSession', '');
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (location?.query?.loggedIn === 'true') {
        setHasSession('true');
        dispatch(updateLoggedInStatus(true));
      }

      if (location?.query?.loggedIn === 'false') {
        teardownProfileSession();
        dispatch(updateLoggedInStatus(false));
        setHasSession('');
      }

      // having the pollTimeout present triggers some api calls to be made locally and in codespaces
      if (!window?.VetsGov?.pollTimeout) {
        window.VetsGov.pollTimeout = 500;
      }
    },
    [setHasSession, dispatch, location],
  );
};
