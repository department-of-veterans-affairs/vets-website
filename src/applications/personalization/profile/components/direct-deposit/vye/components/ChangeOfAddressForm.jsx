import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ADDRESS_DATA from 'platform/forms/address/data';
import { validateAsciiCharacters } from 'platform/user/profile/vap-svc/util';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import {
  VaTextInputField,
  VaSelectField,
} from 'platform/forms-system/src/js/web-component-fields';
import { addressFormRequiredData, blockURLsRegEx } from '../constants';
import { MILITARY_STATES } from '../helper';
import { getFormSchema, getUiSchema } from './addressSchema';

const ChangeOfAddressForm = ({
  children,
  formChange,
  addressFormData,
  formSubmit,
  formData,
}) => {
  const [addressSchema, setAddressSchema] = useState({});
  const [addressUISchema, setAddressUISchema] = useState({});
  const createFormSchema = (requiredArray = []) => {
    const fSchema = getFormSchema(formData);

    if (requiredArray.size === 0) {
      return fSchema;
    }
    const tempSchemaWithRequiredFields = { ...fSchema };
    // remove default required fileds to create an empty array
    tempSchemaWithRequiredFields.required = [];
    // add required fields
    requiredArray.forEach(requiredField =>
      tempSchemaWithRequiredFields.required.push(requiredField),
    );
    // return new schema with updated fields
    return tempSchemaWithRequiredFields;
  };
  const countryCode = {
    title: 'countryCodeIso3',
    addressSchema: {
      type: 'string',
      enum: ['USA'],
      enumNames: ['United States'],
    },
    addressUISchema: {
      'ui:title': 'Country',
      'ui:autocomplete': 'country',
      'ui:webComponentField': VaSelectField,
      'ui:options': {
        inert: true,
      },
    },
  };
  const ipc = {
    title: 'internationalPostalCode',
    'ui:errorMessages': {
      required: 'International Postal code is required',
    },
    'ui:required': () => true,
  };
  const province = {
    title: 'province',
    'ui:errorMessages': {
      required: 'State/Province/Region is required',
    },
    'ui:required': () => true,
  };

  const city = {
    title: 'city',
    addressSchema: {
      type: 'string',
      pattern: blockURLsRegEx,
      enum: ADDRESS_DATA.militaryCities,
      enumNames: ADDRESS_DATA.militaryCities,
      minLength: 1,
      maxLength: 100,
    },
    addressUISchema: {
      'ui:title': addressFormData?.['view:livesOnMilitaryBase']
        ? 'APO/FPO/DPO '
        : 'City ',
      'ui:autocomplete': 'address-level2',
      'ui:webComponentField': addressFormData?.['view:livesOnMilitaryBase']
        ? VaSelectField
        : VaTextInputField,
      'ui:errorMessages': {
        required: 'City is required',
        pattern: `Please enter a valid city under 100 characters`,
      },
      'ui:validations': [validateAsciiCharacters],
    },
  };

  const stateCode = {
    title: 'stateCode',
    addressSchema: {
      type: 'string',
      enum: Object.keys(MILITARY_STATES),
      enumNames: Object.values(MILITARY_STATES),
    },
    addressUISchema: {
      'ui:title': 'State ',
      'ui:autocomplete': 'address-level1',
      'ui:webComponentField': VaSelectField,
      'ui:errorMessages': {
        required: 'State is required',
      },
      'ui:required': () => true,
    },
  };

  const ZC = {
    title: 'zipCode',
    'ui:errorMessages': {
      required: 'Zip code is required',
    },
    'ui:required': () => true,
  };

  const removeObjectKeys = (originalObject, keysToRemove, schemaType) => {
    // Clone the originals object to avoid mutating it
    const newObject = { ...originalObject };

    // Iterate over the keysToRemove array
    keysToRemove.forEach(key => {
      // Remove the specified key

      if (schemaType === 'schema') {
        delete newObject.properties[key];
      }
      if (schemaType === 'uiSchema') {
        delete newObject[key];
      }
    });
    return newObject;
  };

  const addObjectKeys = (
    originalObject,
    keysToAdd,
    valuesToAdd,
    schemaType,
  ) => {
    // Clone the original object to avoid mutating it
    const newObject = { ...originalObject };
    // Iterate over the keysToAdd array
    keysToAdd.forEach((key, index) => {
      // Add the key/value pair to the new object
      // The value is taken from the valuesToAdd array at the same index
      if (schemaType === 'schema') {
        newObject.properties[key] = valuesToAdd[index];
      }
      if (schemaType === 'uiSchema') {
        newObject[key] = valuesToAdd[index];
      }
    });
    return newObject;
  };

  useEffect(
    () => {
      const updateSchema = () => {
        if (addressFormData) {
          // if livesOnMilitaryBase is checked
          if (addressFormData?.['view:livesOnMilitaryBase']) {
            const filteredRequiredArray = addressFormRequiredData.filter(
              requiredField => requiredField !== 'countryCodeIso3',
            );
            const tempSchemaAddObj = addObjectKeys(
              createFormSchema(filteredRequiredArray),
              [city.title, stateCode.title],
              [city.addressSchema, stateCode.addressSchema],
              'schema',
            );
            setAddressSchema(
              removeObjectKeys(
                tempSchemaAddObj,
                [province.title, ipc.title],
                'schema',
              ),
            );

            const tempUISchemaAddObj = addObjectKeys(
              getUiSchema(),
              [countryCode.title, city.title, stateCode.title],
              [
                countryCode.addressUISchema,
                city.addressUISchema,
                stateCode.addressUISchema,
              ],
              'uiSchema',
            );

            const tempUISchemaRemoveObj = removeObjectKeys(
              tempUISchemaAddObj,
              [province.title, ipc.title],
              'uiSchema',
            );
            setAddressUISchema(tempUISchemaRemoveObj);
          }

          // if livesOnMilitaryBase is unchecked
          if (!addressFormData?.['view:livesOnMilitaryBase']) {
            if (
              formData?.countryCodeIso3 === undefined ||
              formData?.countryCodeIso3 === 'USA'
            ) {
              setAddressSchema(
                removeObjectKeys(
                  createFormSchema(addressFormRequiredData),
                  [province.title, ipc.title],
                  'schema',
                ),
              );
              const removeCityUI = removeObjectKeys(
                getUiSchema(),
                [city.title],
                'uiSchema',
              );
              const addNewCityUI = addObjectKeys(
                removeCityUI,
                [city.title],
                [city.addressUISchema],
                'uiSchema',
              );
              setAddressUISchema(
                removeObjectKeys(
                  addNewCityUI,
                  [province.title, ipc.title],
                  'uiSchema',
                ),
              );
            } else {
              // removes stateCode and zipCode as a requiredField
              const tempAddressRequiredData = addressFormRequiredData.filter(
                item => {
                  let result = '';
                  if (item !== stateCode.title && item !== ZC.title) {
                    result = item;
                  }
                  return result;
                },
              );
              // adds province as a requiredField
              setAddressSchema(
                removeObjectKeys(
                  createFormSchema(tempAddressRequiredData),
                  [ZC.title, stateCode.title],
                  'schema',
                ),
              );
              const removeCityUI = removeObjectKeys(
                getUiSchema(),
                [city.title],
                'uiSchema',
              );
              const addNewCityUI = addObjectKeys(
                removeCityUI,
                [city.title],
                [city.addressUISchema],
                'uiSchema',
              );
              setAddressUISchema(
                removeObjectKeys(
                  addNewCityUI,
                  [ZC.title, stateCode.title],
                  'uiSchema',
                ),
              );
            }
          }
        }
      };

      updateSchema();
    },
    [addressFormData, formData],
  );
  return (
    <SchemaForm
      addNameAttribute
      name="Contact Information"
      // title is required by the SchemaForm and used internally
      title="Contact Information"
      schema={addressSchema}
      uiSchema={addressUISchema}
      data={addressFormData}
      onChange={formChange}
      onSubmit={formSubmit}
      data-testid="change-of-address-form"
    >
      {children}
    </SchemaForm>
  );
};

ChangeOfAddressForm.propTypes = {
  addressFormData: PropTypes.object.isRequired,
  formChange: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  formSubmit: PropTypes.func.isRequired,
  cancelButtonClasses: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

ChangeOfAddressForm.defaultProps = {
  cancelButtonClasses: ['usa-button-secondary'],
};

export default ChangeOfAddressForm;
