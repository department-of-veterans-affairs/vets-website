import PropTypes from 'prop-types';
import React, { createContext, useContext } from 'react';

const ConfirmationContext = createContext();
ConfirmationContext.displayName = 'ConfirmationContext';

export const ConfirmationProvider = ({ children, value }) => {
  return (
    <ConfirmationContext.Provider value={value}>
      {children}
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error(
      'useConfirmation must be used within a ConfirmationProvider',
    );
  }
  return context;
};

export default ConfirmationContext;

ConfirmationProvider.propTypes = {
  children: PropTypes.node,
  value: PropTypes.object,
};
