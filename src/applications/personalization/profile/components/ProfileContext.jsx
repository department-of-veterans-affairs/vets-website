import React, { createContext } from 'react';
import { useSelector } from 'react-redux';
import { PROFILE_TOGGLES } from '../constants';
import { selectProfileToggles } from '../selectors';

const initialContext = {
  toggles: { loading: true, ...PROFILE_TOGGLES },
};

export const ProfileContext = createContext(initialContext);

export const ProfileContextWrapper = ({ children }) => {
  const toggles = useSelector(selectProfileToggles);

  return (
    <ProfileContext.Provider
      value={{
        ...initialContext,
        ...{ toggles },
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
