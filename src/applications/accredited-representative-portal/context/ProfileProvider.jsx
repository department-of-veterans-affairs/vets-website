import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { ProfileContext } from './ProfileContext';

const ProfileProvider = ({ children }) => {
  const profile = useLoaderData()?.profile;

  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
