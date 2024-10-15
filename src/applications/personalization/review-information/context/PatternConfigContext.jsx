import React, { createContext } from 'react';
import { useMockedLogin } from '../hooks/useMockedLogin';
import formConfig from '../config/form';

export const PatternConfigContext = createContext();

// eslint-disable-next-line react/prop-types
export const PatternConfigProvider = ({ location, children }) => {
  useMockedLogin(location);
  return (
    <PatternConfigContext.Provider value={formConfig}>
      {children}
    </PatternConfigContext.Provider>
  );
};
