/**
 * The intent for this module is to provide a flexible, reusable address schema and widget that can be used in any form throughout VA.gov.
 * The address uiSchema should be flexible enough to handle these cases:
 * 1. Top level address property (schema.properties.address)
 * 2. Nested address property (schema.properties.someProperty.properties.address)
 * 3. Array items.
 *
 * Fields that may depend on external variables to make the form required:
 * 1. Country - could depend on things like: yes/no field, checkbox in a different form chapter, etc.
 * 2. Address Line 1 - same as country
 * 3. City - same as country
 *
 * Fields that are required based on internal field variables:
 * 1. State - required if the country is the United States OR US Military Address
 * 2. Zipcode - required if the country is the United States OR US Military Address
 * 3. International Postal Code - required if the country is NOT the United States OR US Military address
 *
 * Fields that are optional:
 * 1. State/Province/Region - shows up if the country is NOT the US, but NOT required.
 */

import React from 'react';
import fullSchema from 'vets-json-schema/dist/686C-674-schema.json';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import ADDRESS_DATA from 'platform/forms/address/data';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import get from 'platform/utilities/data/get';
import {
  countries,
  states50AndDC,
  militaryCities,
} from 'vets-json-schema/dist/constants.json';

/**
 * CONSTANTS:
 * 1. MILITARY_STATES - object of military state codes and names.
 * 2. USA - used to just reference the United States
 * 3. MilitaryBaseInfo - expandable text to expound on military base addresses.
 * 4. addressSchema - data model for address schema.
 */

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
  label: 'United States',
};

const MilitaryBaseInfo = () => (
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

/**
 * Builds address schema based on isMilitaryAddress.
 * @param {boolean} isMilitaryBaseAddress represents whether or not the form page requires the address to support the option of military address.
 * @returns {object} an object containing the necessary properties for a domestic US address, foreign US military address, and international address.
 */
export const buildAddressSchema = isMilitaryBaseAddress => {
  const addSchema = fullSchema.definitions.addressSchema;
  if (isMilitaryBaseAddress) return cloneDeep(addSchema);
  const schema = cloneDeep(addSchema);
  delete schema.properties['view:livesOnMilitaryBase'];
  delete schema.properties['view:livesOnMilitaryBaseInfo'];
  return schema;
};

/**
 * This method takes a list of parameters and generates an addressUiSchema.
 * @param {function} callback slots into the 'ui:required' for the necessary fields.
 * @param {string} path represents the path to the address in formData.
 * @param {boolean} isMilitaryBaseAddress represents whether or not the form page requires the address to support the option of military address.
 */

const MILITARY_BASE_PATH = '[view:livesOnMilitaryBase]';

export const addressUISchema = (
  isMilitaryBaseAddress = false,
  path,
  callback,
) => {
  // As mentioned above, there are certain fields that depend on the values of other fields when using updateSchema, replaceSchema, and hideIf.
  // The two constants below are paths used to retrieve the values in those other fields.
  const livesOnMilitaryBasePath = `${path}${MILITARY_BASE_PATH}`;
  const insertArrayIndex = (key, index) => key.replace('[INDEX]', `[${index}]`);
  const checkBoxTitleState = path.includes('veteran') ? 'I' : 'They';

  return (function returnAddressUI() {
    return {
      'view:livesOnMilitaryBase': {
        'ui:title': `${checkBoxTitleState} live on a United States military base outside of the U.S.`,
        'ui:options': {
          hideIf: () => !isMilitaryBaseAddress,
        },
      },
      'view:livesOnMilitaryBaseInfo': {
        'ui:description': MilitaryBaseInfo,
        'ui:options': {
          hideIf: () => !isMilitaryBaseAddress,
        },
      },
      countryName: {
        'ui:required': callback,
        'ui:title': 'Country',
        'ui:options': {
          updateSchema: (formData, schema, uiSchema, index) => {
            let militaryBasePath = livesOnMilitaryBasePath;
            let countryPath = path;
            if (typeof index === 'number') {
              militaryBasePath = insertArrayIndex(
                livesOnMilitaryBasePath,
                index,
              );
              countryPath = insertArrayIndex(path, index);
            }
            const countryUI = uiSchema;
            const countryFormData = get(countryPath, formData);
            const livesOnMilitaryBase = get(militaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              countryUI['ui:disabled'] = true;
              countryFormData.countryName = USA.value;
              return {
                enum: [USA.value],
                enumNames: [USA.label],
                default: USA.value,
              };
            }
            countryUI['ui:disabled'] = false;
            return {
              type: 'string',
              enum: countries.map(country => country.value),
              enumNames: countries.map(country => country.label),
            };
          },
        },
      },
      addressLine1: {
        'ui:required': callback,
        'ui:title': 'Street',
        'ui:errorMessages': {
          required: 'Street address is required',
          pattern: 'Street address must be under 100 characters',
        },
      },
      addressLine2: {
        'ui:title': 'Street address line 2',
      },
      addressLine3: {
        'ui:title': 'Street address line 3',
      },
      city: {
        'ui:required': callback,
        'ui:errorMessages': {
          required: 'City is required',
          pattern: 'City must be under 100 characters',
        },
        'ui:options': {
          replaceSchema: (formData, schema, uiSchema, index) => {
            let militaryBasePath = livesOnMilitaryBasePath;
            if (typeof index === 'number') {
              militaryBasePath = insertArrayIndex(
                livesOnMilitaryBasePath,
                index,
              );
            }
            const livesOnMilitaryBase = get(militaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return {
                type: 'string',
                title: 'APO/FPO/DPO',
                enum: militaryCities.map(city => city.value),
                enumNames: militaryCities.map(city => city.label),
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
        'ui:required': (formData, index) => {
          let countryNamePath = `${path}.countryName`;
          if (typeof index === 'number') {
            countryNamePath = insertArrayIndex(countryNamePath, index);
          }
          const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
          const countryName = get(countryNamePath, formData);
          return (
            (countryName && countryName === USA.value) || livesOnMilitaryBase
          );
        },
        'ui:title': 'State',
        'ui:errorMessages': {
          required: 'State is required',
        },
        'ui:options': {
          hideIf: (formData, index) => {
            // Because we have to update countryName manually in formData above,
            // We have to check this when a user selects a non-US country and then selects
            // the military base checkbox.
            let countryNamePath = `${path}.countryName`;
            let militaryBasePath = livesOnMilitaryBasePath;
            if (typeof index === 'number') {
              militaryBasePath = insertArrayIndex(
                livesOnMilitaryBasePath,
                index,
              );
              countryNamePath = insertArrayIndex(countryNamePath, index);
            }
            const livesOnMilitaryBase = get(militaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return false;
            }
            const countryName = get(countryNamePath, formData);
            return countryName && countryName !== USA.value;
          },
          updateSchema: (formData, schema, uiSchema, index) => {
            let militaryBasePath = livesOnMilitaryBasePath;
            if (typeof index === 'number') {
              militaryBasePath = insertArrayIndex(
                livesOnMilitaryBasePath,
                index,
              );
            }
            const livesOnMilitaryBase = get(militaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
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
          hideIf: (formData, index) => {
            let militaryBasePath = livesOnMilitaryBasePath;
            let countryNamePath = `${path}.countryName`;
            if (typeof index === 'number') {
              militaryBasePath = insertArrayIndex(
                livesOnMilitaryBasePath,
                index,
              );
              countryNamePath = insertArrayIndex(countryNamePath, index);
            }
            const livesOnMilitaryBase = get(militaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return true;
            }
            const countryName = get(countryNamePath, formData);
            return countryName === USA.value || !countryName;
          },
        },
      },
      zipCode: {
        'ui:required': (formData, index) => {
          let militaryBasePath = livesOnMilitaryBasePath;
          let countryNamePath = `${path}.countryName`;
          if (typeof index === 'number') {
            militaryBasePath = insertArrayIndex(livesOnMilitaryBasePath, index);
            countryNamePath = insertArrayIndex(countryNamePath, index);
          }
          const livesOnMilitaryBase = get(militaryBasePath, formData);
          const countryName = get(countryNamePath, formData);
          return (
            (countryName && countryName === USA.value) ||
            (isMilitaryBaseAddress && livesOnMilitaryBase)
          );
        },
        'ui:title': 'Postal Code',
        'ui:errorMessages': {
          required: 'Postal code is required',
          pattern: 'Postal code must be 5 digits',
        },
        'ui:options': {
          widgetClassNames: 'usa-input-medium',
          hideIf: (formData, index) => {
            // Because we have to update countryName manually in formData above,
            // We have to check this when a user selects a non-US country and then selects
            // the military base checkbox.
            let militaryBasePath = livesOnMilitaryBasePath;
            let countryNamePath = `${path}.countryName`;
            if (typeof index === 'number') {
              militaryBasePath = insertArrayIndex(
                livesOnMilitaryBasePath,
                index,
              );
              countryNamePath = insertArrayIndex(countryNamePath, index);
            }
            const livesOnMilitaryBase = get(militaryBasePath, formData);
            const countryName = get(countryNamePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return false;
            }
            return countryName && countryName !== USA.value;
          },
        },
      },
      internationalPostalCode: {
        'ui:required': (formData, index) => {
          let countryNamePath = `${path}.countryName`;
          if (typeof index === 'number') {
            countryNamePath = insertArrayIndex(countryNamePath, index);
          }
          const countryName = get(countryNamePath, formData);
          return countryName && countryName !== USA.value;
        },
        'ui:title': 'International postal code',
        'ui:errorMessages': {
          required: 'International postal code is required',
        },
        'ui:options': {
          widgetClassNames: 'usa-input-medium',
          hideIf: (formData, index) => {
            let militaryBasePath = livesOnMilitaryBasePath;
            let countryNamePath = `${path}.countryName`;
            if (typeof index === 'number') {
              militaryBasePath = insertArrayIndex(
                livesOnMilitaryBasePath,
                index,
              );
              countryNamePath = insertArrayIndex(countryNamePath, index);
            }
            const livesOnMilitaryBase = get(militaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return true;
            }
            const countryName = get(countryNamePath, formData);
            return countryName === USA.value || !countryName;
          },
        },
      },
    };
  })();
};
