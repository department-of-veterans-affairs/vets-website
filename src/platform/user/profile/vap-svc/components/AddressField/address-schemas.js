import React from 'react';

import ADDRESS_DATA from 'platform/forms/address/data';
import cloneDeep from 'platform/utilities/data/cloneDeep';

import { ADDRESS_FORM_VALUES, USA } from '@@vap-svc/constants';

// Regex that uses a negative lookahead to check that a string does NOT contain
// things like `http`, `www.`, or a few common TLDs. Let's cross our fingers and
// hope that we don't have to make this any more complex. We really don't want
// to start playing whack-a-mole with bad addresses
const blockURLsRegEx =
  '^((?!http|www\\.|\\.co|\\.net|\\.gov|\\.edu|\\.org).)*$';

// make an object of just the military state codes and names
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

const STREET_LINE_MAX_LENGTH = 35;

const formSchema = {
  type: 'object',
  properties: {
    'view:livesOnMilitaryBase': {
      type: 'boolean',
    },
    'view:livesOnMilitaryBaseInfo': {
      type: 'object',
      properties: {},
    },
    countryCodeIso3: {
      type: 'string',
      enum: ADDRESS_FORM_VALUES.COUNTRY_ISO3_CODES,
      enumNames: ADDRESS_FORM_VALUES.COUNTRIES,
    },
    addressLine1: {
      type: 'string',
      minLength: 1,
      maxLength: STREET_LINE_MAX_LENGTH,
      pattern: blockURLsRegEx,
    },
    addressLine2: {
      type: 'string',
      minLength: 1,
      maxLength: STREET_LINE_MAX_LENGTH,
      pattern: blockURLsRegEx,
    },
    addressLine3: {
      type: 'string',
      minLength: 1,
      maxLength: STREET_LINE_MAX_LENGTH,
      pattern: blockURLsRegEx,
    },
    city: {
      type: 'string',
      pattern: blockURLsRegEx,
    },
    stateCode: {
      type: 'string',
      enum: Object.keys(ADDRESS_DATA.states),
      enumNames: Object.values(ADDRESS_DATA.states),
    },
    province: {
      type: 'string',
      pattern: blockURLsRegEx,
    },
    zipCode: {
      type: 'string',
      pattern: '^\\d{5}$',
    },
    internationalPostalCode: {
      type: 'string',
      pattern: blockURLsRegEx,
    },
  },
  required: ['countryCodeIso3', 'addressLine1', 'city'],
};

const uiSchema = {
  'view:livesOnMilitaryBase': {
    'ui:title':
      'I live on a United States military base outside of the United States.',
  },
  'view:livesOnMilitaryBaseInfo': {
    'ui:description': () => (
      <p className="profile-military-domestic">
        U.S. military bases are considered a domestic address and a part of the
        United States.
      </p>
    ),
    'ui:options': {
      hideIf: formData => !formData?.['view:livesOnMilitaryBase'],
    },
  },
  countryCodeIso3: {
    'ui:title': 'Country',
    'ui:options': {
      updateSchema: formData => {
        if (formData['view:livesOnMilitaryBase']) {
          return {
            enum: [USA.COUNTRY_ISO3_CODE],
            enumNames: [USA.COUNTRY_NAME],
          };
        }
        return {
          enum: ADDRESS_FORM_VALUES.COUNTRY_ISO3_CODES,
          enumNames: ADDRESS_FORM_VALUES.COUNTRIES,
        };
      },
      updateUiSchema: formData => {
        if (formData['view:livesOnMilitaryBase']) {
          return {
            'ui:disabled': true,
          };
        }
        return {
          'ui:disabled': false,
        };
      },
    },
  },
  addressLine1: {
    'ui:title': `Street address (${STREET_LINE_MAX_LENGTH} characters maximum)`,
    'ui:errorMessages': {
      required: 'Street address is required',
      pattern: `Please enter a valid street address under ${STREET_LINE_MAX_LENGTH} characters`,
    },
  },
  addressLine2: {
    'ui:title': `Line 2 (${STREET_LINE_MAX_LENGTH} characters maximum)`,
    'ui:errorMessages': {
      pattern: `Please enter a valid street address under ${STREET_LINE_MAX_LENGTH} characters`,
    },
  },
  addressLine3: {
    'ui:title': `Line 3 (${STREET_LINE_MAX_LENGTH} characters maximum)`,
    'ui:errorMessages': {
      pattern: `Please enter a valid street address under ${STREET_LINE_MAX_LENGTH} characters`,
    },
  },
  city: {
    'ui:errorMessages': {
      required: 'City is required',
      pattern: `Please enter a valid city under 100 characters`,
    },
    'ui:options': {
      replaceSchema: formData => {
        if (formData['view:livesOnMilitaryBase'] === true) {
          return {
            type: 'string',
            title: 'APO/FPO/DPO',
            enum: ADDRESS_DATA.militaryCities,
          };
        }
        return {
          type: 'string',
          title: 'City',
          minLength: 1,
          maxLength: 100,
          pattern: blockURLsRegEx,
        };
      },
    },
  },
  stateCode: {
    'ui:title': 'State',
    'ui:errorMessages': {
      required: 'State is required',
    },
    'ui:options': {
      hideIf: formData => formData.countryCodeIso3 !== USA.COUNTRY_ISO3_CODE,
      updateSchema: formData => {
        if (formData['view:livesOnMilitaryBase']) {
          return {
            enum: Object.keys(MILITARY_STATES),
            enumNames: Object.values(MILITARY_STATES),
          };
        }
        return {
          enum: Object.keys(ADDRESS_DATA.states),
          enumNames: Object.values(ADDRESS_DATA.states),
        };
      },
    },
    'ui:required': formData =>
      formData.countryCodeIso3 === USA.COUNTRY_ISO3_CODE,
  },
  province: {
    'ui:title': 'State/Province/Region',
    'ui:errorMessages': {
      pattern: `Please enter a valid state, province, or region`,
    },
    'ui:options': {
      hideIf: formData => formData.countryCodeIso3 === USA.COUNTRY_ISO3_CODE,
    },
  },
  zipCode: {
    'ui:title': 'Zip code',
    'ui:errorMessages': {
      required: 'Zip code is required',
      pattern: 'Zip code must be 5 digits',
    },
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      hideIf: formData => formData.countryCodeIso3 !== USA.COUNTRY_ISO3_CODE,
    },
    'ui:required': formData =>
      formData.countryCodeIso3 === USA.COUNTRY_ISO3_CODE,
  },
  internationalPostalCode: {
    'ui:title': 'International postal code',
    'ui:errorMessages': {
      required: 'Postal code is required',
      pattern: 'Please enter a valid postal code',
    },
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      hideIf: formData => formData.countryCodeIso3 === USA.COUNTRY_ISO3_CODE,
    },
    'ui:required': formData =>
      formData.countryCodeIso3 !== USA.COUNTRY_ISO3_CODE,
  },
};

export const getFormSchema = () => cloneDeep(formSchema);
export const getUiSchema = () => cloneDeep(uiSchema);
