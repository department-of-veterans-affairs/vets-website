import React from 'react';
import constants from 'vets-json-schema/dist/constants.json';
import ADDRESS_DATA from 'platform/forms/address/data';
import countries from 'platform/user/profile/vap-svc/constants/countries.json';
import { validateAsciiCharacters } from 'platform/user/profile/vap-svc/util';
import {
  VaSelectField,
  VaTextInputField,
  VaCheckboxField,
} from 'platform/forms-system/src/js/web-component-fields';
import { blockURLsRegEx } from '../constants';
import { sanitizeField, splitAddressLine } from '../helpers';

const cleanZipCode = zipcode => {
  return zipcode?.substring(0, 5);
};

const MILITARY_STATES = new Set(ADDRESS_DATA.militaryStates);

const ADDRESS_FORM_VALUES = {
  STATES: constants.states.USA.map(state => state.value),
  COUNTRIES: countries.map(country => country.countryName),
  COUNTRY_ISO3_CODES: countries.map(country => country.countryCodeISO3),
  MILITARY_STATES,
};
const STREET_LINE_MAX_LENGTH = 20;

export const getFormSchema = (formData = {}) => {
  const defaultCountry =
    countries.find(
      country => country.countryCodeISO3 === formData?.countryCodeIso3,
    )?.countryCodeISO3 || 'USA';
  return {
    type: 'object',
    properties: {
      'view:livesOnMilitaryBase': {
        type: 'boolean',
      },
      'view:livesOnMilitaryBaseInfo': {
        type: 'object',
        properties: {},
        default: !formData['view:livesOnMilitaryBase'],
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
        default: sanitizeField(
          splitAddressLine(formData?.addressLine1, 20).line1,
        ),
      },
      addressLine2: {
        type: 'string',
        minLength: 1,
        maxLength: STREET_LINE_MAX_LENGTH,
        pattern: blockURLsRegEx,
        default:
          splitAddressLine(formData?.addressLine1, 20).line2 ||
          formData?.addressLine2,
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
      zipCode: {
        type: 'string',
        pattern: '^\\d{5}$',
        default: cleanZipCode(formData?.zipCode),
      },
    },
    required: ['addressLine1', 'city'],
  };
};

export const getUiSchema = () => {
  return {
    'view:livesOnMilitaryBase': {
      'ui:title': 'I live on a United States military base outside of the U.S.',
      'ui:webComponentField': VaCheckboxField,
      'ui:options': {
        hideEmptyValueInReview: true,
      },
    },
    'view:livesOnMilitaryBaseInfo': {
      'ui:description': () => (
        <va-additional-info trigger="Learn more about military base addresses">
          <p>
            We automatically enter the United States as your country if you live
            on a military base outside of the country.
          </p>
        </va-additional-info>
      ),
    },
    countryCodeIso3: {
      'ui:title': 'Country',
      'ui:autocomplete': 'country',
      'ui:webComponentField': VaSelectField,
      'ui:options': {
        inert: true,
      },
    },
    addressLine1: {
      'ui:title': `Street address (${STREET_LINE_MAX_LENGTH} characters maximum)`,
      'ui:autocomplete': 'address-line1',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required: 'Street address is required',
        pattern: `Please enter a valid street address under ${STREET_LINE_MAX_LENGTH} characters`,
      },
      'ui:validations': [validateAsciiCharacters],
    },
    addressLine2: {
      'ui:title': `Street address line 2 (${STREET_LINE_MAX_LENGTH} characters maximum)`,
      'ui:autocomplete': 'address-line2',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        pattern: `Please enter a valid street address under ${STREET_LINE_MAX_LENGTH} characters`,
      },
      'ui:validations': [validateAsciiCharacters],
    },
    addressLine3: {
      'ui:title': `Street address line 3 (${STREET_LINE_MAX_LENGTH} characters maximum)`,
      'ui:autocomplete': 'address-line3',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        pattern: `Please enter a valid street address under ${STREET_LINE_MAX_LENGTH} characters`,
      },
      'ui:validations': [validateAsciiCharacters],
    },
    addressLine4: {
      'ui:title': `Street address line 4 (${STREET_LINE_MAX_LENGTH} characters maximum)`,
      'ui:webComponentField': VaTextInputField,
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
      'ui:webComponentField': VaSelectField,
    },
    zipCode: {
      'ui:title': 'Zip code',
      'ui:autocomplete': 'postal-code',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required: 'Zip code is required',
        pattern: 'Zip code must be 5 digits',
      },
    },
  };
};
