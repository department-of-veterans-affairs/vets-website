import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  getFormSchema,
  getUiSchema,
} from '@@vap-svc/components/AddressField/address-schemas';
import ADDRESS_DATA from 'platform/forms/address/data';
import { validateAsciiCharacters } from 'platform/user/profile/vap-svc/util';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { addressFormRequiredData, blockURLsRegEx } from '../constants';
import { MILITARY_STATES } from '../helpers';

const ChangeOfAddressForm = ({
  children,
  formChange,
  addressFormData,
  formSubmit,
}) => {
  const [addressSchema, setAddressSchema] = useState({});
  const [addressUISchema, setAddressUISchema] = useState({});

  const livesOnMilitaryBaseInfo = {
    title: 'view:livesOnMilitaryBaseInfo',
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
      'ui:disabled': true,
    },
  };
  const ipc = {
    title: 'internationalPostalCode',
  };
  const province = {
    title: 'province',
  };

  const city = {
    title: 'city',
    addressSchema: {
      type: 'string',
      pattern: blockURLsRegEx,
      enum: ADDRESS_DATA.militaryCities,
      minLength: 1,
      maxLength: 100,
    },
    addressUISchema: {
      'ui:title': addressFormData?.['view:livesOnMilitaryBase']
        ? 'APO/FPO/DPO'
        : 'City',
      'ui:autocomplete': 'address-level2',
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
      'ui:title': 'State',
      'ui:autocomplete': 'address-level1',
      'ui:errorMessages': {
        required: 'State is required',
      },
      'ui:required': () => true,
    },
  };

  const ZC = {
    title: 'zipCode',
  };

  const createFormSchema = (requiredArray = []) => {
    const fSchema = getFormSchema();
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

  useEffect(() => {
    setAddressSchema(
      removeObjectKeys(
        createFormSchema(addressFormRequiredData),
        [province.title, ipc.title, livesOnMilitaryBaseInfo.title],
        'schema',
      ),
    );
    setAddressUISchema(
      removeObjectKeys(
        getUiSchema(),
        [province.title, ipc.title, livesOnMilitaryBaseInfo.title],
        'uiSchema',
      ),
    );
  }, []);

  useEffect(
    () => {
      const updateSchema = () => {
        if (addressFormData) {
          if (addressFormData?.['view:livesOnMilitaryBase']) {
            const tempSchemaAddObj = addObjectKeys(
              createFormSchema(addressFormRequiredData),
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

          if (!addressFormData?.['view:livesOnMilitaryBase']) {
            if (
              Object.keys(addressFormData).length === 0 ||
              addressFormData?.countryCodeIso3 === 'USA' ||
              addressFormData?.countryCodeIso3 === undefined
            ) {
              setAddressSchema(
                removeObjectKeys(
                  createFormSchema(addressFormRequiredData),
                  [province.title, ipc.title, livesOnMilitaryBaseInfo.title],
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
                  [province.title, ipc.title, livesOnMilitaryBaseInfo.title],
                  'uiSchema',
                ),
              );
            } else {
              // removes stateCode as a requiredField
              const updateAddressRequiredData = addressFormRequiredData.filter(
                item => item !== stateCode.title,
              );
              setAddressSchema(
                removeObjectKeys(
                  createFormSchema(updateAddressRequiredData),
                  [ZC.title, stateCode.title, livesOnMilitaryBaseInfo.title],
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
                  [ZC.title, stateCode.title, livesOnMilitaryBaseInfo.title],
                  'uiSchema',
                ),
              );
            }
          }
        }
      };

      updateSchema();
    },
    [addressFormData],
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
  formChange: PropTypes.func.isRequired,
  addressFormData: PropTypes.object.isRequired,
  // Prefix to apply to all the form's schema fields
  // formPrefix: PropTypes.string.isRequired,
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
