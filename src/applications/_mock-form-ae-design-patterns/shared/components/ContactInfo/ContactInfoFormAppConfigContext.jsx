import React, { createContext, useContext } from 'react';

export const ContactInfoFormAppConfigContext = createContext({});

export const ContactInfoFormAppConfigProvider = ({ children, value }) => {
  return (
    <ContactInfoFormAppConfigContext.Provider value={value}>
      {children}
    </ContactInfoFormAppConfigContext.Provider>
  );
};

export const useContactInfoFormAppConfig = () => {
  const context = useContext(ContactInfoFormAppConfigContext);
  if (!context) {
    return null;
  }
  return context;
};
