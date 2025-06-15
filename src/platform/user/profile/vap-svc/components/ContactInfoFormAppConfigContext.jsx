import React, { createContext, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/exportsFile';
import { getCountryObjectFromIso3 } from 'platform/forms/address/helpers';
import { autoSaveForm } from 'platform/forms/save-in-progress/actions';
import { FIELD_NAMES } from '../constants';

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
  const formId = useSelector(state => state?.form?.formId);
  const version = useSelector(state => state?.form?.version);
  const dispatch = useDispatch();

  const updateContactInfoForFormApp = useCallback(
    async (fieldName, payload, saveOption) => {
      // using the existing timestamp to make sure the conditional logic on the
      // ContactInfo page doesn't override the 'form only' update
      const existingUpdatedAt = formData?.[wrapperKey][fieldName]?.updatedAt;
      const newUpdatedAt = new Date().toISOString();

      const isFormOnly = saveOption === 'no';

      // Use new timestamp for form-only updates, otherwise use existing timestamp
      const updatedAt = isFormOnly ? newUpdatedAt : existingUpdatedAt;

      let updatedFormAppData;

      if (fieldName === FIELD_NAMES.MAILING_ADDRESS) {
        // if we don't get a country name then the ContactInfo page will show
        // an alert that says that the user has no address
        const countryName = getCountryObjectFromIso3(payload.countryCodeIso3)
          ?.countryName;

        updatedFormAppData = {
          ...formData,
          [wrapperKey]: {
            ...formData[wrapperKey],
            [value.formKey]: {
              ...payload,
              updateProfileChoice: saveOption,
              updatedAt,
              countryName,
            },
          },
        };
      } else if (
        [
          FIELD_NAMES.HOME_PHONE,
          FIELD_NAMES.MOBILE_PHONE,
          FIELD_NAMES.EMAIL,
        ].includes(fieldName)
      ) {
        // Handle phone and email updates
        updatedFormAppData = {
          ...formData,
          [wrapperKey]: {
            ...formData[wrapperKey],
            [fieldName]: {
              ...payload,
              // For email/phone, use formOnlyUpdate rather than updateProfileChoice since there's no save to profile question
              formOnlyUpdate: isFormOnly,
              updatedAt,
            },
          },
        };
      }

      const returnUrl = value?.returnPath;

      // First update the Redux store with the new data
      dispatch(setData(updatedFormAppData));

      // Then save to in-progress forms endpoint with the same data
      dispatch(autoSaveForm(formId, updatedFormAppData, version, returnUrl));

      return payload;
    },
    [value, formData, wrapperKey, dispatch, formId, version],
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
    formId: PropTypes.string,
    returnPath: PropTypes.string,
    updateProfileChoice: PropTypes.string,
  }).isRequired,
};
