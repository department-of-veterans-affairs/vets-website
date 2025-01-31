import React from 'react';
import { useSelector } from 'react-redux';
import { isLoggedIn } from 'platform/user/selectors';

import AuthContext from '../AuthContext';
import UnauthContext from '../UnauthContext';

export const App = () => {
  const currentlyLoggedIn = useSelector(isLoggedIn);
  return (
    <>
      <p>
        You can file a claim online through the Beneficiary Travel Self Service
        System (BTSSS).
      </p>
      {currentlyLoggedIn ? <AuthContext /> : <UnauthContext />}
    </>
  );
};

export default App;
