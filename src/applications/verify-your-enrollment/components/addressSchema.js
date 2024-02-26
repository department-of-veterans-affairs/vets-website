import React from 'react';

import constants from 'vets-json-schema/dist/constants.json';
import ADDRESS_DATA from 'platform/forms/address/data';
import countries from 'platform/user/profile/vap-svc/constants/countries.json';
import { validateAsciiCharacters } from 'platform/user/profile/vap-svc/util';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import { blockURLsRegEx } from '../constants';

const MILITARY_STATES = new Set(ADDRESS_DATA.militaryStates);

const ADDRESS_FORM_VALUES = {
  STATES: constants.states.USA.map(state => state.value),
  COUNTRIES: countries.map(country => country.countryName),
  COUNTRY_ISO3_CODES: countries.map(country => country.countryCodeISO3),
  MILITARY_STATES,
};

const STREET_LINE_MAX_LENGTH = 20;

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
    addressLine4: {
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
  },
  countryCodeIso3: {
    'ui:title': 'Country',
    'ui:autocomplete': 'country',
  },
  addressLine1: {
    'ui:title': `Street address (${STREET_LINE_MAX_LENGTH} characters maximum)`,
    'ui:autocomplete': 'address-line1',
    'ui:errorMessages': {
      required: 'Street address is required',
      pattern: `Please enter a valid street address under ${STREET_LINE_MAX_LENGTH} characters`,
    },
    'ui:validations': [validateAsciiCharacters],
  },
  addressLine2: {
    'ui:title': `Street address line 2 (${STREET_LINE_MAX_LENGTH} characters maximum)`,
    'ui:autocomplete': 'address-line2',
    'ui:errorMessages': {
      pattern: `Please enter a valid street address under ${STREET_LINE_MAX_LENGTH} characters`,
    },
    'ui:validations': [validateAsciiCharacters],
  },
  addressLine3: {
    'ui:title': `Street address line 3 (${STREET_LINE_MAX_LENGTH} characters maximum)`,
    'ui:autocomplete': 'address-line3',
    'ui:errorMessages': {
      pattern: `Please enter a valid street address under ${STREET_LINE_MAX_LENGTH} characters`,
    },
    'ui:validations': [validateAsciiCharacters],
  },
  addressLine4: {
    'ui:title': `Street address line 4 (${STREET_LINE_MAX_LENGTH} characters maximum)`,
    'ui:autocomplete': 'address-line4',
    'ui:errorMessages': {
      pattern: `Please enter a valid street address under ${STREET_LINE_MAX_LENGTH} characters`,
    },
    'ui:validations': [validateAsciiCharacters],
  },
  city: {
    'ui:autocomplete': 'address-level2',
    'ui:errorMessages': {
      required: 'City is required',
      pattern: `Please enter a valid city under 100 characters`,
    },
    'ui:validations': [validateAsciiCharacters],
  },
  stateCode: {
    'ui:title': 'State',
    'ui:autocomplete': 'address-level1',
    'ui:errorMessages': {
      required: 'State is required',
    },
  },
  province: {
    'ui:title': 'State/Province/Region',
    'ui:autocomplete': 'address-level1',
    'ui:errorMessages': {
      required: 'State/Province/Region is required',
      pattern: `Please enter a valid state, province, or region`,
    },
    'ui:validations': [validateAsciiCharacters],
  },
  zipCode: {
    'ui:title': 'Zip code',
    'ui:autocomplete': 'postal-code',
    'ui:errorMessages': {
      required: 'Zip code is required',
      pattern: 'Zip code must be 5 digits',
    },
  },
  internationalPostalCode: {
    'ui:title': 'International postal code',
    'ui:autocomplete': 'postal-code',
    'ui:errorMessages': {
      required: 'Postal code is required',
      pattern: 'Please enter a valid postal code',
    },
    'ui:validations': [validateAsciiCharacters],
  },
};

export const getFormSchema = () => cloneDeep(formSchema);
export const getUiSchema = () => cloneDeep(uiSchema);
