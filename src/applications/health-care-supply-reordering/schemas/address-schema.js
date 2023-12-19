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

import { countries } from 'platform/forms/address';
import ADDRESS_DATA from 'platform/forms/address/data';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import get from 'platform/utilities/data/get';
import React from 'react';
import ReviewCardField from '../components/ReviewCardField';
import { militaryCities, states50AndDCAndTerritories } from '../constants';

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
    <va-additional-info trigger="Learn more about military base addresses">
      <span>
        The United States is automatically chosen as your country if you live on
        a military base outside of the country.
      </span>
    </va-additional-info>
  </div>
);

const addressSchema = {
  type: 'object',
  oneOf: [
    {
      properties: {
        country: {
          type: 'string',
          enum: ['CAN'],
        },
        state: {
          type: 'string',
          enum: [
            'AB',
            'BC',
            'MB',
            'NB',
            'NF',
            'NT',
            'NV',
            'NU',
            'ON',
            'PE',
            'QC',
            'SK',
            'YT',
          ],
        },
        postalCode: {
          type: 'string',
          maxLength: 10,
        },
      },
    },
    {
      properties: {
        country: {
          type: 'string',
          enum: ['MEX'],
        },
        state: {
          type: 'string',
          enum: [
            'aguascalientes',
            'baja-california-norte',
            'baja-california-sur',
            'campeche',
            'chiapas',
            'chihuahua',
            'coahuila',
            'colima',
            'distrito-federal',
            'durango',
            'guanajuato',
            'guerrero',
            'hidalgo',
            'jalisco',
            'mexico',
            'michoacan',
            'morelos',
            'nayarit',
            'nuevo-leon',
            'oaxaca',
            'puebla',
            'queretaro',
            'quintana-roo',
            'san-luis-potosi',
            'sinaloa',
            'sonora',
            'tabasco',
            'tamaulipas',
            'tlaxcala',
            'veracruz',
            'yucatan',
            'zacatecas',
          ],
        },
        postalCode: {
          type: 'string',
          maxLength: 10,
        },
      },
    },
    {
      properties: {
        country: {
          type: 'string',
          enum: ['USA'],
        },
        state: {
          type: 'string',
          enum: [
            'AL',
            'AK',
            'AS',
            'AZ',
            'AR',
            'AA',
            'AE',
            'AP',
            'CA',
            'CO',
            'CT',
            'DE',
            'DC',
            'FM',
            'FL',
            'GA',
            'GU',
            'HI',
            'ID',
            'IL',
            'IN',
            'IA',
            'KS',
            'KY',
            'LA',
            'ME',
            'MH',
            'MD',
            'MA',
            'MI',
            'MN',
            'MS',
            'MO',
            'MT',
            'NE',
            'NV',
            'NH',
            'NJ',
            'NM',
            'NY',
            'NC',
            'ND',
            'MP',
            'OH',
            'OK',
            'OR',
            'PW',
            'PA',
            'PR',
            'RI',
            'SC',
            'SD',
            'TN',
            'TX',
            'UT',
            'VT',
            'VI',
            'VA',
            'WA',
            'WV',
            'WI',
            'WY',
          ],
        },
        postalCode: {
          type: 'string',
          maxLength: 10,
        },
      },
    },
    {
      properties: {
        country: {
          not: {
            type: 'string',
            enum: ['CAN', 'MEX', 'USA'],
          },
        },
        state: {
          type: 'string',
          maxLength: 51,
        },
        postalCode: {
          type: 'string',
          maxLength: 51,
        },
      },
    },
    {
      properties: {
        isMilitaryBase: {
          type: 'boolean',
          default: false,
        },
      },
    },
  ],
  properties: {
    isMilitaryBase: {
      type: 'boolean',
      default: false,
    },
    country: {
      type: 'string',
    },
    'view:livesOnMilitaryBaseInfo': {
      type: 'string',
    },
    street: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
      pattern: '^.*\\S.*',
    },
    street2: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
      pattern: '^.*\\S.*',
    },
    city: {
      type: 'string',
      minLength: 1,
      maxLength: 51,
    },
    state: {
      type: 'string',
    },
    province: {
      type: 'string',
    },
    postalCode: {
      type: 'string',
      pattern: '(^\\d{5}$)|(^\\d{5}-\\d{4}$)',
    },
    internationalPostalCode: {
      type: 'string',
    },
  },
};

/**
 * Builds address schema based on isMilitaryAddress.
 * @param {boolean} isMilitaryBaseAddress represents whether or not the form page requires the address to support the option of military address.
 * @returns {object} an object containing the necessary properties for a domestic US address, foreign US military address, and international address.
 */
export const buildAddressSchema = isMilitaryBaseAddress => {
  if (isMilitaryBaseAddress) return cloneDeep(addressSchema);
  const schema = cloneDeep(addressSchema);
  delete schema.properties['view:livesOnMilitaryBaseInfo'];
  return schema;
};

/**
 * This method takes a list of parameters and generates an addressUiSchema.
 * @param {function} callback slots into the 'ui:required' for the necessary fields.
 * @param {string} path represents the path to the address in formData.
 * @param {boolean} isMilitaryBaseAddress represents whether or not the form page requires the address to support the option of military address.
 */

const MILITARY_BASE_PATH = 'isMilitaryBase';

export const addressUISchema = (
  isMilitaryBaseAddress = false,
  path,
  callback,
) => {
  // As mentioned above, there are certain fields that depend on the values of other fields when using updateSchema, replaceSchema, and hideIf.
  // The two constants below are paths used to retrieve the values in those other fields.
  const livesOnMilitaryBasePath = `${path}.${MILITARY_BASE_PATH}`;
  const insertArrayIndex = (key, index) => key.replace('[INDEX]', `[${index}]`);

  const addressDescription = (
    <>
      <p>
        Any updates you make here will only change your mailing address for this
        request.
      </p>
      <p>
        If you want to change your address for other VA benefits and services,
        <a href="https://va.gov/profile" className="vads-u-margin-left--0p5">
          go to your VA.gov profile
        </a>
        . Or
        <a
          href="https://www.va.gov/resources/change-your-address-on-file-with-va"
          className="vads-u-margin-left--0p5"
        >
          find out how to change your address on file with VA
        </a>
        .
      </p>
    </>
  );

  return {
    'ui:order': [
      'isMilitaryBase',
      'view:livesOnMilitaryBaseInfo',
      'country',
      'street',
      'street2',
      'city',
      'state',
      'province',
      'postalCode',
      'internationalPostalCode',
    ],
    'ui:subtitle': addressDescription,
    'ui:field': ReviewCardField,
    isMilitaryBase: {
      'ui:title':
        'I live on a United States military base outside of the United States.',
      'ui:options': {
        hideIf: () => !isMilitaryBaseAddress,
        hideOnReviewIfFalse: true,
        useDlWrap: true,
      },
    },
    'view:livesOnMilitaryBaseInfo': {
      'ui:title': ' ',
      'ui:field': MilitaryBaseInfo,
      'ui:options': {
        hideIf: () => !isMilitaryBaseAddress,
        hideOnReviewIfFalse: true,
        useDlWrap: true,
      },
    },
    country: {
      'ui:required': callback,
      'ui:title': 'Country',
      'ui:options': {
        updateSchema: (formData, schema, uiSchema) => {
          const countryUI = uiSchema;
          const countryFormData = get(path, formData);
          const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
          if (isMilitaryBaseAddress && livesOnMilitaryBase) {
            countryUI['ui:disabled'] = true;
            countryFormData.country = USA.label;
            return {
              enum: [USA.label],
              default: USA.label,
            };
          }
          countryUI['ui:disabled'] = false;
          return {
            type: 'string',
            enum: countries.map(country => country.label),
          };
        },
        useDlWrap: true,
      },
      'ui:errorMessages': {
        required: 'Please select a country',
      },
    },
    street: {
      'ui:required': callback,
      'ui:title': 'Street address',
      'ui:errorMessages': {
        required: 'Please enter a street address',
        pattern: 'Street address must be under 100 characters',
      },
      'ui:options': {
        useDlWrap: true,
      },
    },
    street2: {
      'ui:title': 'Street address line 2',
      'ui:options': {
        hideOnReviewIfFalse: true,
        useDlWrap: true,
      },
    },
    city: {
      'ui:required': callback,
      'ui:errorMessages': {
        required: 'Please enter a city',
        pattern: 'City must be under 100 characters',
      },
      'ui:options': {
        replaceSchema: formData => {
          const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
          if (isMilitaryBaseAddress && livesOnMilitaryBase) {
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
        useDlWrap: true,
      },
    },
    state: {
      'ui:required': (formData, index) => {
        let countryNamePath = `${path}.country`;
        if (typeof index === 'number') {
          countryNamePath = insertArrayIndex(countryNamePath, index);
        }
        const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
        const countryName = get(countryNamePath, formData);
        return (
          (countryName && countryName === USA.label) || livesOnMilitaryBase
        );
      },
      'ui:title': 'State',
      'ui:errorMessages': {
        required: 'Please select a state',
      },
      'ui:options': {
        hideIf: (formData, index) => {
          // Because we have to update countryName manually in formData above,
          // We have to check this when a user selects a non-US country and then selects
          // the military base checkbox.
          let countryNamePath = `${path}.country`;
          if (typeof index === 'number') {
            countryNamePath = insertArrayIndex(countryNamePath, index);
          }
          const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
          if (isMilitaryBaseAddress && livesOnMilitaryBase) {
            return false;
          }
          const countryName = get(countryNamePath, formData);
          return countryName && countryName !== USA.label;
        },
        useDlWrap: true,
        hideOnReviewIfFalse: true,
        updateSchema: formData => {
          const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
          if (isMilitaryBaseAddress && livesOnMilitaryBase) {
            return {
              enum: Object.keys(MILITARY_STATES),
              enumNames: Object.values(MILITARY_STATES),
            };
          }
          return {
            enum: states50AndDCAndTerritories.map(state => state.value),
            enumNames: states50AndDCAndTerritories.map(state => state.label),
          };
        },
      },
    },
    province: {
      'ui:title': 'State/Province/Region',
      'ui:errorMessages': {
        required: 'Please enter a state/province/region',
      },
      'ui:required': (formData, index) => {
        let countryNamePath = `${path}.country`;
        if (typeof index === 'number') {
          countryNamePath = insertArrayIndex(countryNamePath, index);
        }
        const countryName = get(countryNamePath, formData);
        return countryName && countryName !== USA.label;
      },
      'ui:options': {
        hideIf: (formData, index) => {
          let countryNamePath = `${path}.country`;
          if (typeof index === 'number') {
            countryNamePath = insertArrayIndex(countryNamePath, index);
          }
          const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
          if (isMilitaryBaseAddress && livesOnMilitaryBase) {
            return true;
          }
          const countryName = get(countryNamePath, formData);
          return countryName === USA.label || !countryName;
        },
        hideOnReviewIfFalse: true,
        useDlWrap: true,
      },
    },
    postalCode: {
      'ui:required': (formData, index) => {
        let countryNamePath = `${path}.country`;
        if (typeof index === 'number') {
          countryNamePath = insertArrayIndex(countryNamePath, index);
        }
        const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
        const countryName = get(countryNamePath, formData);
        return (
          (countryName && countryName === USA.label) ||
          (isMilitaryBaseAddress && livesOnMilitaryBase)
        );
      },
      'ui:title': 'Postal code',
      'ui:errorMessages': {
        required: 'Please enter a postal code',
        pattern: 'Zip code must be 5 digits',
      },
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
        hideIf: (formData, index) => {
          // Because we have to update countryName manually in formData above,
          // We have to check this when a user selects a non-US country and then selects
          // the military base checkbox.
          let countryNamePath = `${path}.country`;
          if (typeof index === 'number') {
            countryNamePath = insertArrayIndex(countryNamePath, index);
          }
          const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
          const countryName = get(countryNamePath, formData);
          if (isMilitaryBaseAddress && livesOnMilitaryBase) {
            return false;
          }
          return countryName && countryName !== USA.label;
        },
        hideOnReviewIfFalse: true,
        useDlWrap: true,
      },
    },
    internationalPostalCode: {
      'ui:required': (formData, index) => {
        let countryNamePath = `${path}.country`;
        if (typeof index === 'number') {
          countryNamePath = insertArrayIndex(countryNamePath, index);
        }
        const countryName = get(countryNamePath, formData);
        return countryName && countryName !== USA.label;
      },
      'ui:title': 'Please enter an international postal code',
      'ui:errorMessages': {
        required: 'Postal code is required',
      },
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
        hideIf: (formData, index) => {
          let countryNamePath = `${path}.country`;
          if (typeof index === 'number') {
            countryNamePath = insertArrayIndex(countryNamePath, index);
          }
          const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
          if (isMilitaryBaseAddress && livesOnMilitaryBase) {
            return true;
          }
          const countryName = get(countryNamePath, formData);
          return countryName === USA.label || !countryName;
        },
        hideOnReviewIfFalse: true,
        useDlWrap: true,
      },
    },
  };
};
