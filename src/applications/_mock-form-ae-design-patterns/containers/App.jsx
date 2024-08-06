import React, { useEffect } from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

// removes local storage for user profile session indicators
// import { teardownProfileSession } from 'platform/user/profile/utilities';

import formConfig from '../config/form';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function App({ location, children }) {
  const [, setHasSession] = useLocalStorage('hasSession', false);

  useEffect(
    () => {
      if (location?.query?.loggedIn === 'true') {
        setHasSession('hasSession', 'true');
      }
      // teardownProfileSession();
    },
    [location, setHasSession],
  );

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}
