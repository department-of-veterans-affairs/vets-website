import React, { createContext } from 'react';
import PropTypes from 'prop-types';

import { useMockedLogin } from '../../hooks/useMockedLogin';
import { useVADX } from '../panel/useVADX';

export const VADXContext = createContext();

export const VADXProvider = ({ children }) => {
  const { logIn, logOut } = useMockedLogin();
  const vadx = useVADX();

  return (
    <VADXContext.Provider value={{ logIn, logOut, ...vadx }}>
      {children}
    </VADXContext.Provider>
  );
};

VADXProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
