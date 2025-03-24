import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
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

ContactInfoFormAppConfigProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.shape({
    keys: PropTypes.object.isRequired,
    formKey: PropTypes.string.isRequired,
  }).isRequired,
};
