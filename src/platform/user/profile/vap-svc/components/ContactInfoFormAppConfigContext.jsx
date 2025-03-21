import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

/**
 * This context, provider, and hook is used to pass configuration from a form schema object to a set of consuming components.
 * Not required for the Profile applications pages, but used within form system integrations for Profile data.
 */

export const ContactInfoFormAppConfigContext = createContext({});

export const ContactInfoFormAppConfigProvider = ({ children, value }) => {
  const formFieldData = useSelector(
    state => state?.form?.data?.[value.keys.wrapper]?.[value.formKey],
  );

  const contextValue = {
    ...value,
    formFieldData,
  };

  return (
    <ContactInfoFormAppConfigContext.Provider value={contextValue}>
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
