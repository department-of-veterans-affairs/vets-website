import React, { createContext, useContext } from 'react';

/**
 * This context, provider, and hook is used to pass configuration from a form schema object to a set of consuming components.
 * Not required for the Profile applications pages, but used within form system integrations for Profile data.
 */

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
