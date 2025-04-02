import React, { useContext } from 'react';
import { VADXContext } from '../../../context/vadx';

export const LoggedInState = () => {
  const { logIn, logOut, loggedIn } = useContext(VADXContext);

  return (
    <div className="flex flex-col gap-2">
      <small className="vads-u-margin-right--1">
        Logged In Status: {loggedIn ? 'true' : 'false'}
      </small>
      <va-button
        secondary
        onClick={loggedIn ? logOut : logIn}
        text={loggedIn ? 'Simulate Sign Out' : 'Simulate Sign In'}
      />
    </div>
  );
};
