import React, { createContext, useState } from 'react';

// Mock user data
const mockUser = {
  account: {
    accountUuid: '88f572d491af46efa393cba6c351e252',
  },
  profile: {
    firstName: 'William',
    lastName: 'Phelps',
    verified: true,
    signIn: {
      serviceName: 'idme',
    },
  },
  prefillsAvailable: [],
  inProgressForms: [],
};

// Create the UserContext
export const UserContext = createContext();

// Create the UserProvider component
export const UserProvider = ({ children }) => {
  // Initialize user state with mockUser directly
  const [user] = useState(mockUser);
  const [isUserLoading] = useState(false);
  const [error] = useState(null);

  return (
    <UserContext.Provider value={{ user, isUserLoading, error }}>
      {children}
    </UserContext.Provider>
  );
};
