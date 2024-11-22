import React, { createContext } from 'react';

// Create the UserContext
export const UserContext = createContext();

// UserProvider component
export const UserProvider = ({ children, initialUser }) => {
  return (
    <UserContext.Provider value={{ user: initialUser }}>
      {children}
    </UserContext.Provider>
  );
};
