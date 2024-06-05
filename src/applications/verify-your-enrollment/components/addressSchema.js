import React from 'react';

import constants from 'vets-json-schema/dist/constants.json';
import ADDRESS_DATA from 'platform/forms/address/data';
import countries from 'platform/user/profile/vap-svc/constants/countries.json';
import { validateAsciiCharacters } from 'platform/user/profile/vap-svc/util';
import { blockURLsRegEx } from '../constants';

const MILITARY_STATES = new Set(ADDRESS_DATA.militaryStates);

const ADDRESS_FORM_VALUES = {
  STATES: constants.states.USA.map(state => state.value),
  COUNTRIES: countries.map(country => country.countryName),
  COUNTRY_ISO3_CODES: countries.map(country => country.countryCodeISO3),
  MILITARY_STATES,
};

const STREET_LINE_MAX_LENGTH = 20;

export const getFormSchema = (formData = {}) => {
  const defaultCountry = countries.find(
    country => country.countryCodeISO3 === formData?.countryCodeIso3,
  )?.countryCodeISO3;
  return {
    type: 'object',
    properties: {
      'view:livesOnMilitaryBase': {
        type: 'boolean',
      },
      'view:livesOnMilitaryBaseInfo': {
        type: 'object',
        properties: {},
        default: !formData['view:livesOnMilitaryBas'],
      },
      countryCodeIso3: {
        type: 'string',
        enum: ADDRESS_FORM_VALUES.COUNTRY_ISO3_CODES,
        enumNames: ADDRESS_FORM_VALUES.COUNTRIES,
        default: defaultCountry,
      },
      addressLine1: {
        type: 'string',
        minLength: 1,
        maxLength: STREET_LINE_MAX_LENGTH,
        pattern: blockURLsRegEx,
        default: formData?.addressLine1,
      },
      addressLine2: {
        type: 'string',
        minLength: 1,
        maxLength: STREET_LINE_MAX_LENGTH,
        pattern: blockURLsRegEx,
        default: formData?.addressLine2,
      },
      addressLine3: {
        type: 'string',
        minLength: 1,
        maxLength: STREET_LINE_MAX_LENGTH,
        pattern: blockURLsRegEx,
        default: formData?.addressLine3,
      },
      addressLine4: {
        type: 'string',
        minLength: 1,
        maxLength: STREET_LINE_MAX_LENGTH,
        pattern: blockURLsRegEx,
        default: formData?.addressLine4,
      },
      city: {
        type: 'string',
        pattern: blockURLsRegEx,
        default: formData?.city,
      },
      stateCode: {
        type: 'string',
        enum: Object.keys(ADDRESS_DATA.states),
        enumNames: Object.values(ADDRESS_DATA.states),
        default: formData?.stateCode,
      },
      province: {
        type: 'string',
        pattern: blockURLsRegEx,
        default: formData?.province,
      },
      zipCode: {
        type: 'string',
        pattern: '^\\d{5}$',
        default: formData?.zipCode,
      },
      internationalPostalCode: {
        type: 'string',
        pattern: blockURLsRegEx,
        default: formData?.internationalPostalCode,
      },
    },
    required: ['countryCodeIso3', 'addressLine1', 'city'],
  };
};

export const getUiSchema = () => {
  return {
    'view:livesOnMilitaryBase': {
      'ui:title': 'I live on a United States military base outside of the U.S.',
    },
    'view:livesOnMilitaryBaseInfo': {
      'ui:description': () => (
        <va-additional-info trigger="Learn more about military base addresses">
          <p>
            We automatically enter the United States as your country if you live
            on a military case outside of the country.
          </p>
        </va-additional-info>
      ),
    },
    fullName: {
      'ui:title': "Veteran's full name",
      'ui:errorMessages': {
        required: "Please enter the Veteran's Full Name",
      },
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
      // 'ui:autocomplete': 'address-line4',
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
};
