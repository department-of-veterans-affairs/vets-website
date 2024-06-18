import React from 'react';

import ADDRESS_DATA from 'platform/forms/address/data';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import { validateAsciiCharacters } from 'platform/user/profile/vap-svc/util';
import {
  ADDRESS_FORM_VALUES,
  MILITARY_BASE_DATA,
  USA,
} from 'platform/user/profile/vap-svc/constants';

import {
  VaTextInputField,
  VaCheckboxField,
  VaSelectField,
  VaRadioField,
} from 'platform/forms-system/src/js/web-component-fields';

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
const MILITARY_BASE_DATA_INFO = `${MILITARY_BASE_DATA}Info`;

const formSchema = {
  type: 'object',
  properties: {
    [MILITARY_BASE_DATA]: {
      type: 'boolean',
    },
    [MILITARY_BASE_DATA_INFO]: {
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

// See code in forms-system/src/js/web-component-patterns/addressPattern.jsx
// Updated to set Country input to inert instead of disable
const uiSchema = {
  [MILITARY_BASE_DATA]: {
    'ui:title':
      'I live on a United States military base outside of the United States.',
    'ui:webComponentField': VaCheckboxField,
  },
  [MILITARY_BASE_DATA_INFO]: {
    'ui:description': () => (
      <div className="vads-u-padding-x--2p5">
        <va-additional-info trigger="Learn more about military base addresses">
          <span>
            The United States is automatically chosen as your country if you
            live on a military base outside of the country.
          </span>
        </va-additional-info>
      </div>
    ),
  },
  countryCodeIso3: {
    'ui:title': 'Country',
    'ui:autocomplete': 'country',
    'ui:webComponentField': VaSelectField,
    'ui:required': formData => !formData[MILITARY_BASE_DATA],
    'ui:options': {
      updateSchema: (formData, _schema, _uiSchema) => {
        const data = formData || {};
        const countryUiOptions = _uiSchema['ui:options'];
        if (formData[MILITARY_BASE_DATA]) {
          // 'inert' is the preferred solution for now
          // instead of disabled via DST guidance
          countryUiOptions.inert = true;
          data.countryCodeIso3 = USA.COUNTRY_ISO3_CODE;
          return {
            type: 'string',
            enum: [USA.COUNTRY_ISO3_CODE],
            enumNames: [USA.COUNTRY_NAME],
          };
        }
        countryUiOptions.inert = false;
        return {
          type: 'string',
          enum: ADDRESS_FORM_VALUES.COUNTRY_ISO3_CODES,
          enumNames: ADDRESS_FORM_VALUES.COUNTRIES,
        };
      },
    },
  },
  addressLine1: {
    'ui:title': `Street address (${STREET_LINE_MAX_LENGTH} characters maximum)`,
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'address-line1',
    'ui:errorMessages': {
      required: 'Street address is required',
      pattern: `Please enter a valid street address under ${STREET_LINE_MAX_LENGTH} characters`,
    },
    'ui:validations': [validateAsciiCharacters],
  },
  addressLine2: {
    'ui:title': `Street address line 2 (${STREET_LINE_MAX_LENGTH} characters maximum)`,
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'address-line2',
    'ui:errorMessages': {
      pattern: `Please enter a valid street address under ${STREET_LINE_MAX_LENGTH} characters`,
    },
    'ui:validations': [validateAsciiCharacters],
  },
  addressLine3: {
    'ui:title': `Street address line 3 (${STREET_LINE_MAX_LENGTH} characters maximum)`,
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'address-line3',
    'ui:errorMessages': {
      pattern: `Please enter a valid street address under ${STREET_LINE_MAX_LENGTH} characters`,
    },
    'ui:validations': [validateAsciiCharacters],
  },
  city: {
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'address-level2',
    'ui:errorMessages': {
      required: 'City is required',
      pattern: `Please enter a valid city under 100 characters`,
    },
    'ui:validations': [validateAsciiCharacters],
    'ui:options': {
      replaceSchema: formData => {
        if (formData[MILITARY_BASE_DATA] === true) {
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
      updateUiSchema: formData => {
        return {
          'ui:webComponentField':
            formData[MILITARY_BASE_DATA] === true
              ? VaRadioField
              : VaTextInputField,
        };
      },
    },
  },
  stateCode: {
    'ui:title': 'State',
    'ui:webComponentField': VaSelectField,
    'ui:autocomplete': 'address-level1',
    'ui:errorMessages': {
      required: 'State is required',
    },
    'ui:options': {
      hideIf: formData => formData.countryCodeIso3 !== USA.COUNTRY_ISO3_CODE,
      updateSchema: formData => {
        if (formData[MILITARY_BASE_DATA]) {
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
      updateUiSchema: formData => {
        return {
          'ui:webComponentField':
            formData[MILITARY_BASE_DATA] === true
              ? VaRadioField
              : VaSelectField,
        };
      },
    },
    'ui:required': formData =>
      formData.countryCodeIso3 === USA.COUNTRY_ISO3_CODE,
  },
  province: {
    'ui:title': 'State/Province/Region',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'address-level1',
    'ui:errorMessages': {
      pattern: `Please enter a valid state, province, or region`,
    },
    'ui:options': {
      hideIf: formData => formData.countryCodeIso3 === USA.COUNTRY_ISO3_CODE,
    },
    'ui:validations': [validateAsciiCharacters],
  },
  zipCode: {
    'ui:title': 'Zip code',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'postal-code',
    'ui:errorMessages': {
      required: 'Zip code is required',
      pattern: 'Zip code must be 5 digits',
    },
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      hideIf: formData => formData.countryCodeIso3 !== USA.COUNTRY_ISO3_CODE,
    },
    'ui:required': formData => {
      return formData.countryCodeIso3 === USA.COUNTRY_ISO3_CODE;
    },
  },
  internationalPostalCode: {
    'ui:title': 'International postal code',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'postal-code',
    'ui:errorMessages': {
      required: 'Postal code is required',
      pattern: 'Please enter a valid postal code',
    },
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      hideIf: formData => formData.countryCodeIso3 === USA.COUNTRY_ISO3_CODE,
    },
    'ui:validations': [validateAsciiCharacters],
  },
};

export const getFormSchema = () => cloneDeep(formSchema);
export const getUiSchema = () => cloneDeep(uiSchema);
