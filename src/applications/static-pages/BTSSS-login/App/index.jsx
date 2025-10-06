import React from 'react';
import { useSelector } from 'react-redux';
import { isLoggedIn } from 'platform/user/selectors';

import AuthContext from '../AuthContext';
import UnauthContext from '../UnauthContext';

export const App = () => {
  const currentlyLoggedIn = useSelector(isLoggedIn);

  return <>{currentlyLoggedIn ? <AuthContext /> : <UnauthContext />}</>;
};

export default App;
