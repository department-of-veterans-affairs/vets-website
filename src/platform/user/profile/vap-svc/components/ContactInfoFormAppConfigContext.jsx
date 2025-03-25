import React, { createContext, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/exportsFile';
import { getCountryObjectFromIso3 } from 'platform/forms/address/helpers';

/**
 * This context, provider, and hook is used to pass configuration from a form schema object to a set of consuming components.
 * Not required for the Profile applications pages, but used within form system integrations for Profile data.
 */

export const ContactInfoFormAppConfigContext = createContext({});

export const ContactInfoFormAppConfigProvider = ({ children, value }) => {
  const formFieldData = useSelector(
    state => state?.form?.data?.[value.keys.wrapper]?.[value.formKey],
  );

  const wrapperKey = value?.keys?.wrapper;

  const formData = useSelector(state => state?.form?.data);

  const dispatch = useDispatch();

  const updateContactInfoForFormApp = useCallback(
    (fieldName, payload, updateProfileChoice) => {
      // using the existing timestamp to make sure the conditional logic on the
      // ContactInfo page doesn't override the 'form only' update
      const existingUpdatedAt =
        formData?.[wrapperKey][value.formKey]?.updatedAt;

      // if we don't get a country name then the ContactInfo page will show
      // an alert that says that the user has no address
      const countryName = getCountryObjectFromIso3(payload.countryCodeIso3)
        ?.countryName;

      const updatedFormAppData = {
        ...formData,
        [wrapperKey]: {
          ...formData[wrapperKey],
          [value.formKey]: {
            ...payload,
            updateProfileChoice,
            updatedAt: existingUpdatedAt,
            countryName,
          },
        },
      };

      dispatch(setData(updatedFormAppData));

      return {
        ...formFieldData,
        [fieldName]: payload,
      };
    },
    [formData, dispatch, formFieldData, wrapperKey, value.formKey],
  );

  const contextValue = {
    ...value,
    formFieldData,
    updateContactInfoForFormApp,
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
