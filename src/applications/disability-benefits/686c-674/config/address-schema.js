import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import ADDRESS_DATA from 'platform/forms/address/data';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import get from 'platform/utilities/data/get';

import { countries, states50AndDC, militaryCities } from './constants';

// Constants

const MILITARY_STATES = Object.entries(ADDRESS_DATA.states).reduce(
  (militaryStates, [stateCode, stateName]) => {
    if (ADDRESS_DATA.militaryStates.includes(stateCode)) {
      return {
        ...militaryStates,
        [stateCode]: stateName,
      };
    }
    return militaryStates;
  },
  {},
);

const USA = {
  value: 'USA',
  name: 'United States',
};

const militaryBaseInfo = () => (
  <div className="vads-u-padding-x--2p5">
    <AdditionalInfo
      status="info"
      triggerText="Learn more about military base addresses"
    >
      <span>
        The United States is automatically chosen as your country if you live on
        a military base outside of the country.
      </span>
    </AdditionalInfo>
  </div>
);

const addressSchema = {
  type: 'object',
  properties: {
    'view:livesOnMilitaryBase': {
      type: 'boolean',
    },
    'view:livesOnMilitaryBaseInfo': {
      type: 'object',
      properties: {},
    },
    countryName: {
      type: 'string',
      enum: countries.map(country => country.label),
      default: USA.name,
    },
    addressLine1: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: '^.*\\S.*',
    },
    addressLine2: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: '^.*\\S.*',
    },
    addressLine3: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: '^.*\\S.*',
    },
    city: {
      type: 'string',
    },
    stateCode: {
      type: 'string',
      enum: states50AndDC.map(state => state.value),
      enumNames: states50AndDC.map(state => state.label),
    },
    province: {
      type: 'string',
    },
    zipCode: {
      type: 'string',
      pattern: '^\\d{5}$',
    },
    internationalPostalCode: {
      type: 'string',
    },
  },
};

/*
The intent for this module is to provide a flexible, reusable address schema and widget that can be used in any form throughout VA.gov.
The address uiSchema should be flexible enough to handle these cases:
1. Top level address property (schema.properties.address)
2. Nested address property (schema.properties.someProperty.properties.address)
3. Array items.

Fields that may depend on external variables to make the form required:
1. Country - could depend on things like: yes/no field, checkbox in a different form chapter, etc.
2. Address Line 1 - same as country
3. City - same as country

Fields that are required based on internal field variables:
1. State - required if the country is the United States OR US Military Address
2. Zipcode - required if the country is the United States OR US Military Address
3. International Postal Code - required if the country is NOT the United States OR US Military address

Fields that are optional:
1. State/Province/Region - shows up if the country is NOT the US, but NOT required.
*/

/**
 * Builds address schema based on isMilitaryAddress.
 * @param {boolean} isMilitaryAddress
 * @returns {object} an object containing the necessary properties for a domestic US address, foreign US military address, and international address.
 */
export const buildAddressSchema = isMilitaryAddress => {
  if (isMilitaryAddress) return cloneDeep(addressSchema);
  const schema = cloneDeep(addressSchema);
  delete schema.properties['view:livesOnMilitaryBase'];
  delete schema.properties['view:livesOnMilitaryBaseInfo'];
  return schema;
};

/**
 * This method takes a list of parameters and generates an addressUiSchema.
 * @param {function} callback a function that slots into the 'ui:required' for the necessary fields.
 * @param {testPath} string a string that is used to get the value of 'view:livesOnMilitaryBase' and update city and state enums with military address values.
 */
export const buildAddressUiSchema = () => {};

export const addressUISchema = (
  isMilitaryBase = false,
  path,
  testPath,
  callback,
) => ({
  'view:livesOnMilitaryBase': {
    'ui:title':
      'I live on a United States military base outside of the United States',
    'ui:options': {
      hideIf: () => !isMilitaryBase,
    },
  },
  'view:livesOnMilitaryBaseInfo': {
    'ui:description': militaryBaseInfo,
    'ui:options': {
      hideIf: () => !isMilitaryBase,
    },
  },
  countryName: {
    'ui:required': callback,
    'ui:title': 'Country',
    'ui:options': {
      updateSchema: (formData, schema, uiSchema) => {
        const countryUI = uiSchema;
        const countryFormData = formData[`${path}`];
        const livesOnMilitaryBase = get(testPath, formData);
        if (isMilitaryBase && livesOnMilitaryBase) {
          countryUI['ui:disabled'] = true;
          countryFormData.countryName = USA.name;
          return {
            enum: [USA.name],
            default: USA.name,
          };
        }
        countryUI['ui:disabled'] = false;
        return {
          type: 'string',
          enum: countries.map(country => country.label),
        };
      },
    },
  },
  addressLine1: {
    'ui:required': callback,
    'ui:title': 'Street address',
    'ui:errorMessages': {
      required: 'Street address is required',
      pattern: 'Street address must be under 100 characters',
    },
  },
  addressLine2: {
    'ui:title': 'Street address',
  },
  addressLine3: {
    'ui:title': 'Street address',
  },
  city: {
    'ui:required': callback,
    'ui:errorMessages': {
      required: 'City is required',
      pattern: 'City must be under 100 characters',
    },
    'ui:options': {
      replaceSchema: formData => {
        const livesOnMilitaryBase = get(testPath, formData);
        if (isMilitaryBase && livesOnMilitaryBase) {
          return {
            type: 'string',
            title: 'APO/FPO/DPO',
            enum: militaryCities,
          };
        }
        return {
          type: 'string',
          title: 'City',
          minLength: 1,
          maxLength: 100,
          pattern: '^.*\\S.*',
        };
      },
    },
  },
  stateCode: {
    'ui:required': formData => {
      const livesOnMilitaryBase = get(testPath, formData);
      return (
        formData[`${path}`].countryName === USA.name || livesOnMilitaryBase
      );
    },
    'ui:title': 'State',
    'ui:errorMessages': {
      required: 'State is required',
    },
    'ui:options': {
      hideIf: formData => {
        // Because we have to update countryName manually in formData above,
        // We have to check this when a user selects a non-US country and then selects
        // the military base checkbox.
        const livesOnMilitaryBase = get(testPath, formData);
        if (isMilitaryBase && livesOnMilitaryBase) {
          return false;
        }
        return formData[`${path}`].countryName !== USA.name;
      },
      updateSchema: formData => {
        const livesOnMilitaryBase = get(testPath, formData);
        if (isMilitaryBase && livesOnMilitaryBase) {
          return {
            enum: Object.keys(MILITARY_STATES),
            enumNames: Object.values(MILITARY_STATES),
          };
        }
        return {
          enum: states50AndDC.map(state => state.value),
          enumNames: states50AndDC.map(state => state.label),
        };
      },
    },
  },
  province: {
    'ui:title': 'State/Province/Region',
    'ui:options': {
      hideIf: formData => {
        const livesOnMilitaryBase = get(testPath, formData);
        if (isMilitaryBase && livesOnMilitaryBase) {
          return true;
        }
        return formData[`${path}`].countryName === USA.name;
      },
    },
  },
  zipCode: {
    'ui:required': formData => {
      const livesOnMilitaryBase = get(testPath, formData);
      return (
        formData[`${path}`].countryName === USA.name ||
        (isMilitaryBase && livesOnMilitaryBase)
      );
    },
    'ui:title': 'Zip Code',
    'ui:errorMessages': {
      required: 'Zip code is required',
      pattern: 'Zip code must be 5 digits',
    },
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      hideIf: formData => {
        // Because we have to update countryName manually in formData above,
        // We have to check this when a user selects a non-US country and then selects
        // the military base checkbox.
        const livesOnMilitaryBase = get(testPath, formData);
        if (isMilitaryBase && livesOnMilitaryBase) {
          return false;
        }
        return formData[`${path}`].countryName !== USA.name;
      },
    },
  },
  internationalPostalCode: {
    'ui:required': formData => formData[`${path}`].countryName !== USA.name,
    'ui:title': 'International postal code',
    'ui:errorMessages': {
      required: 'Postal code is required',
    },
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      hideIf: formData => {
        const livesOnMilitaryBase = get(testPath, formData);
        if (isMilitaryBase && livesOnMilitaryBase) {
          return true;
        }
        return formData[`${path}`].countryName === USA.name;
      },
    },
  },
});
